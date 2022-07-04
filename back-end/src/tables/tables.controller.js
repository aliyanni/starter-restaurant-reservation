const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({ status: 400, message: "Body must have a data property." });
}

function hasTableName(req, res, next) {
  const name = req.body.data.table_name;
  if (name) {
    return next();
  }
  next({ status: 400, message: "table_name property required." });
}

function validTableName(req, res, next) {
  const tableName = req.body.data.table_name;
  if (tableName.length >= 2) {
    return next();
  }
  next({
    status: 400,
    message: "table_name must be longer than 2 characters.",
  });
}

function hasTableCapacity(req, res, next) {
  const capacity = req.body.data.capacity;
  if (capacity) {
    return next();
  }
  next({ status: 400, message: "table capacity property required" });
}

function validTableCapacity(req, res, next) {
  const capacity = req.body.data.capacity;
  if (capacity >= 1 && typeof capacity === "number") {
    return next();
  }
  next({ status: 400, message: "capacity must be at least 1 person." });
}

async function create(req, res) {
  const table = req.body.data;
  const data = await service.create(table);
  res.status(201).json({ data });
}

module.exports = {
  create: [
    hasData,
    hasTableName,
    validTableName,
    hasTableCapacity,
    validTableCapacity,
    asyncErrorBoundary(create),
  ],
};
