const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const { JSDOM } = require("jsdom");
const createDOMPurify = require("dompurify");
const cors = require("cors");
require("dotenv").config();
const fileUpload = require("express-fileupload");
const path = require("path");
const app = express();
const { startDB } = require("./models");
const routes = require("./routes");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const {
  createOrder,
} = require("./controllers/websites/ecommerce/ordersController");

// Helmet para segurança de cabeçalhos HTTP
app.use(helmet());

// Rate Limiting para prevenir ataques de força bruta e DDoS
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutos
  max: 100, // Limite de 100 requisições por IP por janela de tempo
});
app.use(limiter);

// Configurar trust proxy de forma mais restritiva
app.set("trust proxy", "loopback, linklocal, uniquelocal");

// Sanitização de dados para prevenir injeção de SQL
app.use(mongoSanitize());

// Configurar DOMPurify
const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

// Middleware para sanitizar dados usando DOMPurify
app.use((req, res, next) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = DOMPurify.sanitize(req.body[key]); // Sanitizar strings no corpo da requisição
      }
    }
  }
  next();
});

// Lista de domínios permitidos a partir da variável de ambiente
const allowedOrigins = process.env.CORS_ORIGINS.split(",");

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir solicitações sem origem (como as feitas por ferramentas de teste)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Permite o envio de cookies
  })
);

// Enable cookie parsing middleware
app.use(cookieParser());

// const { setup } = require('csrf-csrf');
// // Configure CSRF protection
// const { csrf, generateToken } = setup({
//   cookie: true, // Enable cookie-based CSRF protection
// });

// // Enable CSRF middleware
// app.use(csrf);

// EXAMPLE OF CSRF TOKEN GENERATION
// app.get('/api/csrf-token', (req, res) => {
//   res.json({ csrfToken: generateToken(res) });
// });

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(fileUpload());
// Servir arquivos estáticos do diretório 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", routes);

app.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      // Aqui podes obter os dados necessários do paymentIntent.metadata
      // Exemplo: customerId, shippingAddress, billingAddress
      const { customerId, shippingAddress, billingAddress } =
        paymentIntent.metadata;

      // Chama a lógica de criação da encomenda
      // Podes adaptar createOrder para ser chamada internamente, sem req/res
      await createOrder({ customerId, shippingAddress, billingAddress });
    }

    res.json({ received: true });
  }
);

// Servir a documentação do Swagger apenas no ambiente de desenvolvimento
const swaggerRoutes = require("./swagger");
app.use("/api-docs", swaggerRoutes);

app.listen({ port: 2001 }, async () => {
  startDB();
});
