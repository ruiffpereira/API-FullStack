import express from "express";
import "dotenv/config";
import path from "path";
import { applySecurity } from "./src/middleware/security";
import { applyParsers } from "./src/middleware/parsers";
import { startDB } from "./models";
import routes from "./routes";
import swaggerRoutes from "./swagger";

const requiredEnvVars = ["JWT_SECRET", "JWT_SECRET_PUBLIC", "STRIPE_SECRET_KEY"];
for (const key of requiredEnvVars) {
  if (!process.env[key]) throw new Error(`Missing required environment variable: ${key}`);
}

const app = express();

applySecurity(app);

applyParsers(app);

app.use("/api", routes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api-docs", swaggerRoutes);
app.get("/health", (_req, res) => res.status(200).send("ok"));

app.listen({ port: 3001 }, () => startDB());
