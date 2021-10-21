const express = require("express");
const AuthController = require("../../application/controllers/AuthController");

const router = express.Router();

router.route("/users").get(AuthController.getAll);
router.route("/register").post(AuthController.register);

router.get("/:id", (req, res) => {
  res.send("Acerca de esta wiki");
});

module.exports = router;
