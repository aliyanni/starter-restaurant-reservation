const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await service.read(reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `Reservation ${reservationId} not found` });
}

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({ status: 400, message: "Body must have data property." });
}

function hasFirstName(req, res, next) {
  const name = req.body.data.first_name;
  if (name) {
    return next();
  }
  next({ status: 400, message: "first_name property required." });
}

function hasLastName(req, res, next) {
  const name = req.body.data.last_name;
  if (name) {
    return next();
  }
  next({ status: 400, message: "last_name property required." });
}

function hasMobileNumber(req, res, next) {
  const phone = req.body.data.mobile_number;
  if (phone) {
    return next();
  }
  next({ status: 400, message: "mobile_number property required." });
}

function noTuesday(req, res, next) {
  const date = req.body.data.reservation_date;
  const weekday = new Date(date).getUTCDay();
  if (weekday !== 2) {
    return next();
  }
  next({ status: 400, message: "reservation_date is not valid, restaurant closed on Tuesdays." });
}

function noReservationsInPast(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const now = Date.now();
  const proposedReservation = new Date(
    `${reservation_date} ${reservation_time}`
  ).valueOf();
  if (proposedReservation > now) {
    return next();
  }
  next({ status: 400, message: "reservation_date must be in future." });
}

function hasReservationDate(req, res, next) {
  const date = req.body.data.reservation_date;
  if (date) {
    return next();
  }
  next({ status: 400, message: "reservation_date property required." });
}

function validDate(req, res, next) {
  const date = req.body.data.reservation_date;
  const valid = Date.parse(date);
  if (valid) {
    return next();
  }
  next({ status: 400, message: "reservation_date must be valid date." });
}

function hasReservationTime(req, res, next) {
  const time = req.body.data.reservation_time;
  if (time && typeof time === "string") {
    return next();
  }
  next({ status: 400, message: "Valid reservation_time property required." });
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

function reservationDuringHours(req, res, next) {
  const time = req.body.data.reservation_time;
  const open = "10:30";
  const close = "21:30";
  if (time >= open && time <= close) {
    return next();
  }
  next({ status: 400, message: "reservation_time must be between 10:30 AM and 9:30 PM."});
}

function hasValidPeople(req, res, next) {
  const people = req.body.data.people;
  if (people > 0 && typeof people === "number") {
    return next();
  }
  next({ status: 400, message: "Valid people property required" });
}

async function list(req, res) {
  let date = req.query.date;
  let data = [];
  if (date) {
    data = await service.listByDate(date);
  }
  res.json({
    data,
  });
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

async function updateStatus(req, res) {
  const status = req.body.data.status;
  const reservationId = req.params.reservationId;
  const result = await service.updateStatus(reservationId, status);
  res.status(200).json({ data: { status: result[0].status } })
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasData,
    hasFirstName,
    hasLastName,
    hasMobileNumber,
    hasReservationDate,
    validDate,
    noTuesday,
    hasReservationTime,
    validTime,
    noReservationsInPast,
    reservationDuringHours,
    hasValidPeople,
    asyncErrorBoundary(create),
  ],
  read: [
    asyncErrorBoundary(reservationExists), 
    read
  ],
  updateStatus: [
    asyncErrorBoundary(updateStatus)
  ]
};
