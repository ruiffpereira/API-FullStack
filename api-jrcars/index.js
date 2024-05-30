const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { startDB } = require("./models");
const { user, service, schedules } = require("./routes");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use("/", user);

app.use("/", service);

app.use("/", schedules);

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.listen({ port: 3000 }, async () => {
  startDB();
});
