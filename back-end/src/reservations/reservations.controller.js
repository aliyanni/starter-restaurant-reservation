const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/requiredProperties");

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({ status: 400, message: "Body must have data property." });
}

const REQUIRED_PROPERTIES = [
  "first_name",
  "last_name",
  "people",
  "reservation_date",
  "reservation_time",
  "mobile_number",
];
const hasRequiredProperties = hasProperties(...REQUIRED_PROPERTIES);

function validPeople(req, res, next) {
  const people = req.body.data.people;
  if (people > 0 && typeof people === "number") {
    return next();
  }
  next({ status: 400, message: "Valid people property required" });
}

function validDate(req, res, next) {
  const date = req.body.data.reservation_date;
  const valid = new Date(date) !== "Invalid Date" && !isNaN(new Date(date));
  if (valid) {
    return next();
  }
  next({ status: 400, message: "reservation_date must be valid date." });
}

function validTime(req, res, next) {
  const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  const time = req.body.data.reservation_time;
  const valid = time.match(regex);
  if (valid) {
    return next();
  }
  next({ status: 400, message: "reservation_time must be valid time." });
}

function validStatus(req, res, next) {
  const status = req.body.data.status;
  if (status !== "seated" && status !== "finished") {
    return next();
  }
  next({
    status: 400,
    message: "status cannot be seated, finished.",
  });
}

function updateValidStatus(req, res, next) {
  const status = req.body.data.status;
  if (status !== "unknown") {
    return next();
  }
  next({
    status: 400,
    message: "status cannot be unknown.",
  });
}

async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await service.read(reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `Reservation ${reservationId} not found` });
}

function noReservationsInPast(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const [hour, minute] = reservation_time.split(":");
  let [year, month, date] = reservation_date.split("-");
  month -= 1;
  const reservationDate = new Date(year, month, date, hour, minute, 59, 59);
  const today = new Date();

  if (today <= reservationDate) {
    return next();
  }
  return next({
    status: 400,
    message: `reservation_date must be set in the future`,
  });
}

function noTuesday(req, res, next) {
  const date = req.body.data.reservation_date;
  let [year, month, day] = date.split("-");
  // Month is 0 index based when passing into the Date constructor so, minus 1 to get the correct month
  month -= 1;
  const weekday = new Date(year, month, day).getDay();
  if (weekday !== 2) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_date is not valid, restaurant closed on Tuesdays.",
  });
}

function reservationDuringHours(req, res, next) {
  const time = req.body.data.reservation_time;
  const open = "10:30";
  const close = "21:30";
  if (time >= open && time <= close) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_time must be between 10:30 AM and 9:30 PM.",
  });
}

function notFinished(req, res, next) {
  const reservation = res.locals.reservation;
  if (reservation.status === "finished") {
    next({
      status: 400,
      message: "reservation cannot already be finished.",
    });
  } else {
    return next();
  }
}

async function list(req, res) {
  const { date, currentDate, mobile_number } = req.query;
  if (date) {
    const data = await service.listByDate(date);
    res.json({ data });
  } else if (currentDate) {
    const data = await service.listByDate(currentDate);
    res.json({ data });
  } else if (mobile_number) {
    const data = await service.listByPhone(mobile_number);
    res.json({ data });
  } else {
    const data = await service.list();
    res.json({ data });
  }
}

async function create(req, res) {
  const reservation = req.body.data;
  const data = await service.create(reservation);
  res.status(201).json({ data });
}

async function read(req, res) {
  const reservationId = req.params.reservationId;
  const data = await service.read(reservationId);
  res.json({ data });
}

async function updateReservation(req, res) {
  const reservation = req.body.data;
  const newRes = await service.updateReservation(reservation);
  const result = newRes[0];
  res.status(200).json({ data: result });
}

async function updateStatus(req, res) {
  const status = req.body.data.status;
  const reservationId = req.params.reservationId;
  const result = await service.updateStatus(reservationId, status);
  res.status(200).json({ data: { status: result[0].status } });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    hasRequiredProperties,
    validPeople,
    validDate,
    validTime,
    validStatus,
    noReservationsInPast,
    noTuesday,
    reservationDuringHours,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  updateReservation: [
    asyncErrorBoundary(reservationExists),
    hasRequiredProperties,
    validPeople,
    validDate,
    validTime,
    validStatus,
    noTuesday,
    reservationDuringHours,
    asyncErrorBoundary(updateReservation),
  ],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    updateValidStatus,
    notFinished,
    asyncErrorBoundary(updateStatus),
  ],
};
