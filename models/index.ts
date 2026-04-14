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

export const startDB = async (): Promise<void> => {
  try {
    await sequelize.sync();
    applyAssociations();
    await sequelize.authenticate();
    // Correr na primeira vez para popular a base de dados com dados de teste
    // const seeder = await import("../seeders/20260407123456-dummy-data");
    // await seeder.default.up(sequelize.getQueryInterface(), sequelize);
    const environment = process.env.ENVIROMENT;
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
};
