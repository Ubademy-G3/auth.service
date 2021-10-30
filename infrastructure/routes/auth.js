const express = require("express");
const AuthController = require("../../application/controllers/AuthController");

const router = express.Router();

// Register & Login
router.route("/signup").post(AuthController.signup);
router.route("/login").post(AuthController.login);

// Authentication
router.route("/verify-token").get(AuthController.authenticate);

module.exports = router;
