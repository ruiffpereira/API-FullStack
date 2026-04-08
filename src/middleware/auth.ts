import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
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

const swaggerActivationStart = Date.now();
const swaggerActivationDuration = 20 * 60 * 1000;

export const swaggerAccessMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (process.env.ENVIROMENT === "DEV") {
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

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.sendStatus(401);
    return;
  }
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    next();
  });
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
  jwt.verify(token, JWT_SECRET, async (err: any, customer: any) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    req.customerId = (customer as jwt.JwtPayload).customerId;
    const customerRecord = await Customer.findOne({
      where: { customerId: req.customerId },
    });
    if (!customerRecord) {
      res.status(404).send();
      return;
    }
    req.userId = customerRecord.userId;
    next();
  });
};

export const authenticateTokenPublic = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    res.sendStatus(401);
    return;
  }
  jwt.verify(token, JWT_SECRET_PUBLIC, (err: any, user: any) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    req.userId = (user as jwt.JwtPayload).userId;
    next();
  });
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

      const permissionName = await Permission.findAll({
        where: { permissionId },
      });

      console.log("permissionName:", permissionName);
      if (permissionName[0]?.name === "Admin") {
        console.log("Autorizado Permissao");
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
        console.log("Nao Autorizado Permissao");
        res
          .status(403)
          .json({ error: "User does not have the required permissions" });
        return;
      }

      console.log("Autorizado Permissao");
      next();
    } catch (error) {
      console.error("Error checking permissions:", error);
      res
        .status(500)
        .json({ error: "An error occurred while checking permissions" });
    }
  };
};
