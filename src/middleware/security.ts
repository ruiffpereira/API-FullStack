import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";
import { Express, Request, Response, NextFunction } from "express";

export function applySecurity(app: Express): void {
  app.use(helmet());

  app.use(rateLimit({ windowMs: 60_000, max: 100 }));

  app.set("trust proxy", "loopback, linklocal, uniquelocal");

  app.use(mongoSanitize());

  const window = new JSDOM("").window as unknown as Parameters<
    typeof createDOMPurify
  >[0];
  const DOMPurify = createDOMPurify(window);

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
}
