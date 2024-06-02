const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { startDB } = require("./models");
// const { user, service, schedules } = require("./routes");
const { products, clients } = require("./routes");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/", products);

app.use("/", clients);

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.listen({ port: 3001 }, async () => {
  startDB();
});
