export {};

declare global {
  namespace Express {
    interface Request {
      user?: string;
      customerId?: string;
      userId?: string;
    }
  }
}
