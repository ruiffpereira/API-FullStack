import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import {
  UserPermission,
  Component,
  ComponentPermission,
  Permission,
  User,
  Customer,
} from "../../models";

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_SECRET_PUBLIC = process.env.JWT_SECRET_PUBLIC as string;

const verifyJwt = promisify(jwt.verify) as (
  token: string,
  secret: string,
) => Promise<jwt.JwtPayload>;

const swaggerActivationStart = Date.now();
const swaggerActivationDuration = 20 * 60 * 1000;

export const swaggerAccessMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (process.env.ENVIRONMENT === "DEV") {
    return next();
  }
  const currentTime = Date.now();
  if (currentTime - swaggerActivationStart > swaggerActivationDuration) {
    res
      .status(403)
      .json({ error: "Access to Swagger documentation has expired" });
    return;
  }
  next();
};

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.sendStatus(401);
    return;
  }
  try {
    const decoded = await verifyJwt(token, JWT_SECRET);
    req.user = decoded.userId;
    const userRecord = await User.findOne({ where: { userId: req.user } });
    if (!userRecord) {
      res.status(404).send();
      return;
    }
    next();
  } catch {
    res.sendStatus(403);
  }
};

export const authenticateTokenCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.sendStatus(401);
    return;
  }
  try {
    const decoded = await verifyJwt(token, JWT_SECRET);
    req.customerId = decoded.customerId;
    const customerRecord = await Customer.findOne({
      where: { customerId: req.customerId },
    });
    if (!customerRecord) {
      res.status(404).send();
      return;
    }
    req.userId = customerRecord.userId;
    next();
  } catch {
    res.sendStatus(403);
  }
};

export const authenticateTokenPublic = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.sendStatus(401);
    return;
  }
  try {
    const decoded = await verifyJwt(token, JWT_SECRET_PUBLIC);
    req.userId = decoded.userId;
    next();
  } catch {
    res.sendStatus(403);
  }
};

export const authorizePermissions = (requiredPermissions: string[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const userId = req.user;
    try {
      const permissions = await UserPermission.findAll({ where: { userId } });
      const permissionId = permissions.map((up) => up.permissionId);

      const permissionNames = await Permission.findAll({
        where: { permissionId },
      });
      if (permissionNames.some((p) => p.name === "Admin")) {
        return next();
      }

      const components = await Component.findAll({
        where: { name: requiredPermissions },
      });
      const componentId = components.map((component) => component.componentId);

      const hasRequiredPermissions = await ComponentPermission.findAll({
        where: { permissionId, componentId },
      });

      if (hasRequiredPermissions.length === 0) {
        res
          .status(403)
          .json({ error: "User does not have the required permissions" });
        return;
      }

      next();
    } catch (error) {
      console.error("Error checking permissions:", error);
      res
        .status(500)
        .json({ error: "An error occurred while checking permissions" });
    }
  };
};
