const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { startDB } = require("./models");
const routes = require('./routes');
const cors = require('cors');
require('dotenv').config();

app.use(cors({
  origin: process.env.CORS_ORIGIN, // Substitua pelo domínio do seu frontend
  credentials: true, // Permite o envio de cookies
}))

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use('/api', routes);

app.listen({ port: 3001 }, async () => {
  startDB();
});