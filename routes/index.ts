import { Router } from "express";
import {
  authenticateToken,
  authorizePermissions,
  authenticateTokenCustomers,
  authenticateTokenPublic,
} from "../src/middleware/auth";

import userRoutes from "./backoffice/admin/userRoutes";
import userPermissionRoutes from "./backoffice/admin/userPermissionRoutes";
import permissionRoutes from "./backoffice/admin/permissionRoutes";
import customersBORoutes from "./backoffice/customers/customerRoutes";
import componentsRoutes from "./backoffice/admin/componentsRoutes";
import categoryRoutes from "./backoffice/ecommerce/categoryRoutes";
import subcategoryRoutes from "./backoffice/ecommerce/subcategoryRoutes";
import productRoutes from "./backoffice/ecommerce/productRoutes";
import orderRoutes from "./backoffice/ecommerce/orderRoutes";
import orderProductRoutes from "./backoffice/ecommerce/orderProductRoutes";
import customerRoutes from "./websites/customers/customerRoutes";
import addressRoutes from "./websites/customers/addressRoutes";
import bankCardRoutes from "./websites/customers/bankCardRoutes";
import cartRoutes from "./websites/ecommerce/cartRoutes";
import ordersRoutes from "./websites/ecommerce/ordersRoutes";
import productsRoutes from "./websites/ecommerce/productsRoutes";

const router = Router();

// BACKOFFICE
router.use("/users", userRoutes);
router.use("/userpermissions", authenticateToken, userPermissionRoutes);
router.use(
  "/permissions",
  authenticateToken,
  authorizePermissions(["VIEW_ADMIN"]),
  permissionRoutes,
);
router.use(
  "/customers",
  authenticateToken,
  authorizePermissions(["VIEW_CUSTOMERS"]),
  customersBORoutes,
);
router.use(
  "/components",
  authenticateToken,
  authorizePermissions(["VIEW_ADMIN"]),
  componentsRoutes,
);
router.use(
  "/categories",
  authenticateToken,
  authorizePermissions(["VIEW_PRODUCTS"]),
  categoryRoutes,
);
router.use(
  "/subcategories",
  authenticateToken,
  authorizePermissions(["VIEW_PRODUCTS"]),
  subcategoryRoutes,
);
router.use(
  "/products",
  authenticateToken,
  authorizePermissions(["VIEW_PRODUCTS"]),
  productRoutes,
);
router.use(
  "/orders",
  authenticateToken,
  authorizePermissions(["VIEW_PRODUCTS"]),
  orderRoutes,
);
router.use(
  "/ordersproduct",
  authenticateToken,
  authorizePermissions(["VIEW_PRODUCTS"]),
  orderProductRoutes,
);

// WEBSITES
router.use(
  "/websites/customers/autentication",
  authenticateTokenPublic,
  customerRoutes,
);
router.use(
  "/websites/customers/addresses",
  authenticateTokenCustomers,
  addressRoutes,
);
router.use(
  "/websites/customers/bankcards",
  authenticateTokenCustomers,
  bankCardRoutes,
);
router.use("/websites/ecommerce/carts", authenticateTokenCustomers, cartRoutes);
router.use(
  "/websites/ecommerce/orders",
  authenticateTokenCustomers,
  ordersRoutes,
);
router.use(
  "/websites/ecommerce/products",
  authenticateTokenPublic,
  productsRoutes,
);

export default router;
