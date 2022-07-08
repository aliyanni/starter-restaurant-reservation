/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

router
.route("/")
.get(controller
.list)
.post(controller.create);
//.all(methodNotAllowed);

router
.route("/:reservationId([0-9]+)")
.get(controller.read);
//.all(methodNotAllowed);

router
.route("/:reservationId([0-9]+)/status")
.put(controller.updateStatus)

module.exports = router;
