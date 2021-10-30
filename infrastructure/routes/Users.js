const express = require("express");
const UsersController = require("../../application/controllers/UsersController");

const router = express.Router();

// Basic CRUD
router.route("/").get(UsersController.getAll);
router.route("/:id").get(UsersController.get);
router.route("/").post(UsersController.create);
router.route("/:id").put(UsersController.update);
router.route("/:id").delete(UsersController.delete);

module.exports = router;