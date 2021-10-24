const express = require("express");
const AuthController = require("../../application/controllers/AuthController");

const router = express.Router();

// Basic CRUD
router.route("/users").get(AuthController.getAll);
router.route("/users/:id").get(AuthController.get);

// Register & Login
router.route("/signup").post(AuthController.signup);
router.route("/login").post(AuthController.login);

// Authentication
router.route("/authenticate").post(AuthController.authenticate);

router.get("/:id", (req, res) => {
  res.send("Acerca de esta wiki");
});

module.exports = router;
