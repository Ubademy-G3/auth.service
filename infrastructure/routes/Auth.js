const express = require("express");
const AuthController = require("../../application/controllers/AuthController");
const UsersController = require("../../application/controllers/UsersController");

const router = express.Router();

// Authorization & Authentication
router.route("/authorization").post(AuthController.signup);
router.route("/authentication").post(AuthController.login);
router.route("/authentication").get(AuthController.authenticate);

// Basic CRUD
router.route("/authorization").get(UsersController.getAll);
router.route("/authorization/:id").get(UsersController.get);
//router.route("/authorization/").post(UsersController.create);
router.route("/authorization/:id").put(UsersController.update);
router.route("/authorization/:id").delete(UsersController.delete);

// Password reset
router.route("/password-reset").post(AuthController.sendPasswordResetEmail);
//router.route("/password-reset/:userId/:token").post(AuthController.passwordReset);

module.exports = router;
