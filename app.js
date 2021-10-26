const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const auth = require("./infrastructure/routes/Auth");

const app = express();
app.use(cors());

app.use(express.json());
app.use("/auth", auth);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;
