import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpecBackoffice } from "../swagger/backoffice/swaggerBackoffice";
import { swaggerSpecWebsitesCustomers } from "../swagger/websites/customers/swaggerCustomers";
import { swaggerSpecWebsitesEcommerce } from "../swagger/websites/ecommerce/swaggerEcommerce";
import { swaggerSpecWebsitesBooking } from "../swagger/websites/booking/swaggerBooking";
import { swaggerAccessMiddleware } from "../src/middleware/auth";

const router = Router();

router.use(
  "/backoffice",
  swaggerAccessMiddleware,
  swaggerUi.serveFiles(swaggerSpecBackoffice),
  swaggerUi.setup(swaggerSpecBackoffice, {
    swaggerOptions: { validatorUrl: null },
  }),
);
router.get("/backoffice.json", swaggerAccessMiddleware, (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpecBackoffice);
});

router.use(
  "/websites/customers",
  swaggerAccessMiddleware,
  swaggerUi.serveFiles(swaggerSpecWebsitesCustomers),
  swaggerUi.setup(swaggerSpecWebsitesCustomers, {
    swaggerOptions: { validatorUrl: null },
  }),
);
router.get("/websites/customers.json", swaggerAccessMiddleware, (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpecWebsitesCustomers);
});

router.use(
  "/websites/ecommerce",
  swaggerAccessMiddleware,
  swaggerUi.serveFiles(swaggerSpecWebsitesEcommerce),
  swaggerUi.setup(swaggerSpecWebsitesEcommerce, {
    swaggerOptions: { validatorUrl: null },
  }),
);
router.get("/websites/ecommerce.json", swaggerAccessMiddleware, (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpecWebsitesEcommerce);
});

router.use(
  "/websites/booking",
  swaggerUi.serveFiles(swaggerSpecWebsitesBooking),
  swaggerUi.setup(swaggerSpecWebsitesBooking, {
    swaggerOptions: { validatorUrl: null },
  }),
);
router.get("/websites/booking.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpecWebsitesBooking);
});

export default router;
