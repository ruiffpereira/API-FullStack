declare module "express-mongo-sanitize" {
  import { RequestHandler } from "express";
  function mongoSanitize(options?: {
    replaceWith?: string;
    allowDots?: boolean;
    dryRun?: boolean;
  }): RequestHandler;
  export = mongoSanitize;
}
