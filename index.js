const app = require("./app");
const db = require("./infrastructure/db/mongoose");
require("dotenv").config();

db.connection.once("open", () => {
  // console.log("connected to MongoDB database!");
});

app.listen(process.env.PORT, () => {
  // console.log(`App running on port ${process.env.PORT}`);
});
