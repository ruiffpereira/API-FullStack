import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";
import cors from "cors";
import "dotenv/config";
import fileUpload from "express-fileupload";
import path from "path";
import Stripe from "stripe";
import { startDB } from "./models";
import routes from "./routes";
import swaggerRoutes from "./swagger";
import {
  Order,
  OrderProduct,
  Cart,
  CartProduct,
  Product,
  Customer,
  Address,
} from "./models";

const app = express();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Helmet para segurança de cabeçalhos HTTP
app.use(helmet());

// Rate Limiting para prevenir ataques de força bruta e DDoS
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 100,
});
app.use(limiter);

// Configurar trust proxy de forma mais restritiva
app.set("trust proxy", "loopback, linklocal, uniquelocal");

// Sanitização de dados para prevenir injeção de NoSQL
app.use(mongoSanitize());

// Configurar DOMPurify
const window = new JSDOM("").window as unknown as Parameters<
  typeof createDOMPurify
>[0];
const DOMPurify = createDOMPurify(window);

// Middleware para sanitizar dados usando DOMPurify
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = DOMPurify.sanitize(req.body[key]);
      }
    }
  }
  next();
});

// Lista de domínios permitidos a partir da variável de ambiente
const allowedOrigins = (process.env.CORS_ORIGINS ?? "").split(",");

app.use(
  cors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Cookie parsing
app.use(cookieParser());

// Body Parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(fileUpload());

// Servir arquivos estáticos do diretório 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", routes);

// Stripe webhook — must use raw body BEFORE bodyParser
app.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response): Promise<void> => {
    const sig = req.headers["stripe-signature"] as string;
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET as string,
      );
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { customerId, shippingAddress, billingAddress } =
        paymentIntent.metadata;

      try {
        const cart = await Cart.findOne({
          where: { customerId },
          include: [
            {
              model: CartProduct,
              as: "cartProducts",
              attributes: ["quantity", "productId"],
              include: [
                {
                  model: Product,
                  as: "product",
                  attributes: ["productId", "name", "price"],
                },
              ],
            },
          ],
        });
        const customer = await Customer.findOne({
          where: { customerId },
          attributes: ["email", "name"],
        });
        const userRecord = await Customer.findOne({
          where: { customerId },
          attributes: ["userId"],
        });
        const shipping = await Address.findOne({
          where: { addressId: shippingAddress, customerId },
        });
        const billing = await Address.findOne({
          where: { addressId: billingAddress, customerId },
        });

        if (
          !cart ||
          !(cart as any).cartProducts?.length ||
          !userRecord ||
          !shipping ||
          !billing
        ) {
          console.error(
            "Webhook createOrder: missing data for customerId",
            customerId,
          );
          res.status(400).json({ error: "Missing order data" });
          return;
        }

        const totalPrice = (cart as any).cartProducts.reduce(
          (total: number, item: any) =>
            total + item.product.price * item.quantity,
          0,
        );
        const newOrder = await Order.create({
          customerId,
          userId: (userRecord as any).userId,
          price: totalPrice,
          shippingAddress,
          billingAddress,
        });

        const orderProducts = (cart as any).cartProducts.map((item: any) => ({
          orderId: (newOrder as any).orderId,
          productId: item.productId,
          quantity: item.quantity,
          priceAtPurchase: item.product.price,
        }));
        await OrderProduct.bulkCreate(orderProducts);
        await CartProduct.destroy({ where: { cartId: (cart as any).cartId } });

        console.log("Order created via webhook for customer", customerId);
      } catch (err) {
        console.error("Error creating order via webhook:", err);
        res.status(500).json({ error: "Order creation failed" });
        return;
      }
    }

    res.json({ received: true });
  },
);

// Swagger docs
app.use("/api-docs", swaggerRoutes);

app.listen({ port: 3001 }, async () => {
  startDB();
});
