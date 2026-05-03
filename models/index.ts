import { Sequelize } from "sequelize";
import dbConfig from "../config/config";
import { applyAssociations } from "./associations";

import { initUser, User } from "./user";
import { initCustomer, Customer } from "./customer";
import { initCategory, Category } from "./category";
import { initSubcategory, Subcategory } from "./subcategory";
import { initProduct, Product } from "./product";
import { initOrder, Order } from "./order";
import { initOrderProduct, OrderProduct } from "./orderProduct";
import { initPermission, Permission } from "./permission";
import { initUserPermission, UserPermission } from "./userPermission";
import { initComponent, Component } from "./component";
import {
  initComponentPermission,
  ComponentPermission,
} from "./componentPermission";
import { initCart, Cart } from "./cart";
import { initCartProduct, CartProduct } from "./cartProduct";
import { initBankCard, BankCard } from "./bankCart";
import { initAddress, Address } from "./address";
import { initShipping, Shipping } from "./shipping";
import { initRefreshToken, RefreshToken } from "./refreshToken";
import { initService, Service } from "./service";
import { initAppointment, Appointment } from "./appointment";
import { initWorkingHours, WorkingHours } from "./workingHours";
import { initBlockedSlot, BlockedSlot } from "./blockedSlot";

const sequelize = new Sequelize(
  dbConfig.database!,
  dbConfig.username!,
  dbConfig.password,
  {
    logging: false,
    host: dbConfig.host,
    port: dbConfig.port ? parseInt(dbConfig.port, 10) : 3306,
    dialect: dbConfig.dialect as "mysql" | "postgres" | "sqlite" | "mssql",
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    dialectOptions: {
      connectTimeout: 60000,
    },
  },
);

initUser(sequelize);
initCustomer(sequelize);
initCategory(sequelize);
initSubcategory(sequelize);
initProduct(sequelize);
initOrder(sequelize);
initOrderProduct(sequelize);
initPermission(sequelize);
initUserPermission(sequelize);
initComponent(sequelize);
initComponentPermission(sequelize);
initCart(sequelize);
initCartProduct(sequelize);
initBankCard(sequelize);
initAddress(sequelize);
initShipping(sequelize);
initRefreshToken(sequelize);
initService(sequelize);
initAppointment(sequelize);
initWorkingHours(sequelize);
initBlockedSlot(sequelize);

const REQUIRED_COMPONENTS = [
  "VIEW_ADMIN",
  "VIEW_PRODUCTS",
  "VIEW_CUSTOMERS",
  "VIEW_SCHEDULE",
];

const REQUIRED_PERMISSIONS = [
  { name: "Admin", description: "Acesso total ao backoffice" },
  { name: "User", description: "Acesso padrão" },
];

const ensureBaseData = async (): Promise<void> => {
  // Ensure permissions
  for (const p of REQUIRED_PERMISSIONS) {
    await Permission.findOrCreate({ where: { name: p.name }, defaults: p });
  }

  // Ensure components
  const components: Component[] = [];
  for (const name of REQUIRED_COMPONENTS) {
    const [comp] = await Component.findOrCreate({ where: { name }, defaults: { name } });
    components.push(comp);
  }

  // Link ALL components to the Admin permission
  const adminPerm = await Permission.findOne({ where: { name: "Admin" } });
  if (adminPerm) {
    for (const comp of components) {
      await ComponentPermission.findOrCreate({
        where: { permissionId: adminPerm.permissionId, componentId: comp.componentId },
        defaults: { permissionId: adminPerm.permissionId, componentId: comp.componentId },
      });
    }
  }

  // Log permissions for easy bootstrap
  const perms = await Permission.findAll({ attributes: ["permissionId", "name"] });
  console.log("Permissions disponíveis:", perms.map((p) => `${p.name}: ${p.permissionId}`).join(" | "));
};

export const startDB = async (): Promise<void> => {
  try {
    await sequelize.sync();
    applyAssociations();
    await sequelize.authenticate();
    await ensureBaseData();
    const environment = process.env.ENVIRONMENT;
    console.log(
      `Connection has been established successfully in ${environment} environment.`,
    );
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

export {
  sequelize,
  User,
  Customer,
  Category,
  Subcategory,
  Product,
  Order,
  OrderProduct,
  Permission,
  UserPermission,
  Component,
  ComponentPermission,
  Cart,
  CartProduct,
  Address,
  BankCard,
  Shipping,
  RefreshToken,
  Service,
  Appointment,
  WorkingHours,
  BlockedSlot,
};
