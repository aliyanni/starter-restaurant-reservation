const service = require("./reservations.service");
const asyncErrorBoundary = require('../errors/asyncErrorBoundary');

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
  create: asyncErrorBoundary(create)
};
