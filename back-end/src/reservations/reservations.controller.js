const service = require("./reservations.service");
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

async function reservationExists(req, res, next) {
  const { reservationId } = req.params;
  const reservation = await service.read(reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservationId} not found`,
  })
}

function hasData(req, res, next) {
  if (req.body) {
    return next();
  }
  next({
    status: 400,
    message: "Body must have data property."
  })
}   

function hasFirstName(req, res, next) {
  const name = req.body.first_name;
  if (name) {
    return next();
  }
  next({
    status: 400,
    message: "first_name property required.",
  })
}

function hasLastName(req, res, next) {
  const name = req.body.last_name;
  if (name) {
    return next();
  }
  next({
    status: 400,
    message: "last_name property required.",
  })
}

function hasMobileNumber(req, res, next) {
  const phone = req.body.mobile_number;
  if (phone) {
    return next();
  }
  next({
    status: 400,
    message: "mobile_number property required.",
  })
}

function hasReservationDate(req, res, next) {
  const date = req.body.reservation_date;
  if (date) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_date property required.",
  })
}

function validDate(req, res, next) {
  const date = req.body.reservation_date;
  const valid = Date.parse(date);

  if (valid) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_date must be valid date.",
  })
}

function hasReservationTime(req, res, next) {
  const time = req.body.reservation_time;
  if (time && typeof time === 'string') {
    return next();
  }
  next({
    status: 400,
    message: "valid reservation_time property required.",
  })
}

function validTime(req, res, next) {
  const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  const time = req.body.reservation_time;
  const valid = time.match(regex);
  if (valid) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_time must be valid time.",
  })
}

function hasValidPeople(req, res, next) {
  const people = req.body.people;
  
  if (people > 0) {
    return next();
  }
  next({
    status: 400,
    message: "valid people property required"
  })
}


async function list(req, res) {
  let date = req.query.date;
  let data = [];
  if(date){
    data = await service.listByDate(date);
  }
  res.json({
    data,
  });
}

async function create(req, res){
  const reservation = req.body;
  console.log(reservation, "RESER");
  const data = await service.create(reservation);
  res.status(201).json({ data });
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
    hasReservationTime,
    validTime,
    hasValidPeople,
    asyncErrorBoundary(create)
  ]
};
