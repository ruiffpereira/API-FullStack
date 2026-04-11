import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import { Express } from "express";

export function applyParsers(app: Express): void {
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(
    fileUpload({
      limits: { fileSize: 5 * 1024 * 1024 }, //5mb
      abortOnLimit: true,
    }),
  );
}
