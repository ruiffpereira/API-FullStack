const express = require("express");

const router = express.Router();
const {
  authenticateToken,
  authorizePermissions,
  authenticateTokenCustomers,
  authenticateTokenPublic,
} = require("../src/middleware/auth");

// BACkOFFICE ROUTES ***************************************************************************************************

// ADMIN
const userRoutes = require("./backoffice/admin/userRoutes");
router.use("/users", userRoutes);

const userPermissionRoutes = require("./backoffice/admin/userPermissionRoutes");
router.use("/userpermissions", authenticateToken, userPermissionRoutes);

const permissionRoutes = require("./backoffice/admin/permissionRoutes");
router.use(
  "/permissions",
  authenticateToken,
  authorizePermissions(["VIEW_ADMIN"]),
  permissionRoutes
);

const customersBORoutes = require("./backoffice/customers/customerRoutes");
router.use(
  "/customers",
  authenticateToken,
  authorizePermissions(["VIEW_CUSTOMERS"]),
  customersBORoutes
);

const componentsRoutes = require("./backoffice/admin/componentsRoutes");
router.use(
  "/components",
  authenticateToken,
  authorizePermissions(["VIEW_ADMIN"]),
  componentsRoutes
);

//ECOMMERCE
const categoryRoutes = require("./backoffice/ecommerce/categoryRoutes");
router.use(
  "/categories",
  authenticateToken,
  authorizePermissions(["VIEW_PRODUCTS"]),
  categoryRoutes
);

const subcategoryRoutes = require("./backoffice/ecommerce/subcategoryRoutes");
router.use(
  "/subcategories",
  authenticateToken,
  authorizePermissions(["VIEW_PRODUCTS"]),
  subcategoryRoutes
);

const productRoutes = require("./backoffice/ecommerce/productRoutes");
router.use(
  "/products",
  authenticateToken,
  authorizePermissions(["VIEW_PRODUCTS"]),
  productRoutes
);

const orderRoutes = require("./backoffice/ecommerce/orderRoutes");
router.use(
  "/orders",
  authenticateToken,
  authorizePermissions(["VIEW_PRODUCTS"]),
  orderRoutes
);

const orderProductRoutes = require("./backoffice/ecommerce/orderProductRoutes");
router.use(
  "/ordersproduct",
  authenticateToken,
  authorizePermissions(["VIEW_PRODUCTS"]),
  orderProductRoutes
);

// WEBSITES ROUTES ***************************************************************************************************

// CUSTOMERS
const customerRoutes = require("./websites/customers/customerRoutes");
router.use(
  "/websites/customers/autentication",
  authenticateTokenPublic,
  customerRoutes
);

const addressRoutes = require("./websites/customers/addressRoutes");
router.use(
  "/websites/customers/addresses",
  authenticateTokenCustomers,
  addressRoutes
);

const bankCardRoutes = require("./websites/customers/bankCardRoutes");
router.use(
  "/websites/customers/bankcards",
  authenticateTokenCustomers,
  bankCardRoutes
);

const cartRoutes = require("./websites/ecommerce/cartRoutes");
router.use("/websites/ecommerce/carts", authenticateTokenCustomers, cartRoutes);

const ordersRoutes = require("./websites/ecommerce/ordersRoutes");
router.use(
  "/websites/ecommerce/orders",
  authenticateTokenCustomers,
  ordersRoutes
);

// ECOMMERCE
const productsRoutes = require("./websites/ecommerce/productsRoutes");
router.use(
  "/websites/ecommerce/products",
  authenticateTokenPublic,
  productsRoutes
);

// END ***************************************************************************************************

module.exports = router;
