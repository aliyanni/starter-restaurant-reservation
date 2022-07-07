/**
 * Defines the router for tables resources.
 *
 * @type {Router}
 */

 const router = require("express").Router();
 const controller = require("./tables.controller");

 router
 .route("/:table_id([0-9]+)/seat")
 .put(controller.updateSeatReservation)
 //.all(methodNotAllowed);

 router
 .route("/")
 .get(controller.list)
 .post(controller.create);
 //.all(methodNotAllowed);
 
 module.exports = router;