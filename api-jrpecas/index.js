const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { startDB } = require("./models");
const routes = require('./routes');

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use('/api', routes);

app.listen({ port: 3001 }, async () => {
  startDB();
});
