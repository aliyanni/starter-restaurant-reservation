const knex = require("../db/connection");

function list() {
  return knex("reservations").select("*").orderBy("reservation_time");
}

function listByDate(reservation_date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date })
    .orderBy("reservation_time");
}

function create(newReservation) {
  return knex("reservations")
    .insert({
      ...newReservation,
    })
    .returning("*")
    .then((result) => result[0]);
}

module.exports = {
  list,
  listByDate,
  create,
};
