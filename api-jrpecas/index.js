const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { startDB } = require("./models");
const routes = require('./routes');
const cors = require('cors');

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use('/api', routes);

app.listen({ port: 3001 }, async () => {
  startDB();
});
