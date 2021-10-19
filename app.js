const express = require("express");
const swaggerUi = require("swagger-ui-express");
const client = require("mongoose");
const swaggerDocument = require("./swagger.json");
const auth = require("./infrastructure/routes/auth");

const app = express();

client.connect(process.env.MONGODB_URI, { useNewUrlParser: true });

app.use("/auth", auth);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/ping", (req, res) => res.send("Pong!"));

// app.get('/status', (req, res) =>
//    client.query('SELECT NOW()', (err) => res.send({ service: 'UP', db: err ? 'DOWN' : 'UP' }))
// );

app.listen(process.env.PORT, () => {
  // console.log(`App running on port ${process.env.PORT}`);
});
