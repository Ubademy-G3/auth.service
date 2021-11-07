const express = require("express");
const AuthController = require("../../application/controllers/AuthController");
const UsersController = require("../../application/controllers/UsersController");

const router = express.Router();

// Authorization & Authentication
router.route("/authorization").post(AuthController.signup);
router.route("/authentication").post(AuthController.login);
router.route("/authentication").get(AuthController.authenticate);

// CRUD
router.route("/authorization/users").get(UsersController.getAll);
router.route("/authorization/users/:id").get(UsersController.get);
router.route("/authorization/users").post(UsersController.create);
router.route("/authorization/users/:id").put(UsersController.update);
router.route("/authorization/users/:id").delete(UsersController.delete);

// Password reset
router.route("/authorization/password").post(AuthController.sendPasswordResetEmail);
router.route("/authorization/password/:userId/:token").post(AuthController.passwordReset);

module.exports = router;
