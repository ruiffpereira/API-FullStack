import express from "express";
import "dotenv/config";
import path from "path";
import { applySecurity } from "./src/middleware/security";
import { applyParsers } from "./src/middleware/parsers";
import { startDB } from "./models";
import routes from "./routes";
import swaggerRoutes from "./swagger";

const app = express();

applySecurity(app);

app.use("/api", routes);

applyParsers(app);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api-docs", swaggerRoutes);

app.listen({ port: 3001 }, () => startDB());
