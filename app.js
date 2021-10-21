const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const auth = require("./infrastructure/routes/Auth");

const app = express();

app.use(express.json());
app.use("/auth", auth);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/ping", (req, res) => res.send("Pong!"));



app.listen(process.env.PORT, () => {
  // console.log(`App running on port ${process.env.PORT}`);
});
