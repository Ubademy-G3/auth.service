const express = require("express");

const router = express.Router();

// Home page route
router.get("/", (req, res) => {
  res.send("Página de inicio");
});

// Id page route
router.get("/:id", (req, res) => {
  res.send("Acerca de esta wiki");
});

module.exports = router;
