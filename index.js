const express = require("express");
const bodyParser = require("body-parser");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config();
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();
const { startDB } = require("./models");
const routes = require('./routes');

// Helmet para segurança de cabeçalhos HTTP
app.use(helmet());

// Rate Limiting para prevenir ataques de força bruta e DDoS
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutos
  max: 100, // Limite de 100 requisições por IP por janela de tempo
});
app.use(limiter);

// Configurar trust proxy de forma mais restritiva
app.set('trust proxy', 'loopback, linklocal, uniquelocal');

// Sanitização de dados para prevenir injeção de SQL e XSS
app.use(mongoSanitize());
app.use(xss());

console.log("aquicors: ", process.env.CORS_ORIGINS);
// Lista de domínios permitidos a partir da variável de ambiente
const allowedOrigins = process.env.CORS_ORIGINS.split(',');

app.use(cors({
  origin: (origin, callback) => {
    // Permitir solicitações sem origem (como as feitas por ferramentas de teste)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Permite o envio de cookies
}));

// Segurança de Cookies
app.use((req, res, next) => {
  res.cookie('session', '1', { httpOnly: true, secure: true, sameSite: 'strict' });
  next();
});

// Configuração de CSRF
// app.use(cookieParser());
// app.use(csrf({ cookie: true }));

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(fileUpload());
// Servir arquivos estáticos do diretório 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api', routes);

app.listen({ port: 2001 }, async () => {
  startDB();
});