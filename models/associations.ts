import { User } from "./user";
import { Customer } from "./customer";
import { Category } from "./category";
import { Subcategory } from "./subcategory";
import { Product } from "./product";
import { Order } from "./order";
import { OrderProduct } from "./orderProduct";
import { Permission } from "./permission";
import { UserPermission } from "./userPermission";
import { Component } from "./component";
import { ComponentPermission } from "./componentPermission";
import { Cart } from "./cart";
import { CartProduct } from "./cartProduct";
import { BankCard } from "./bankCart";
import { Address } from "./address";
import { Shipping } from "./shipping";
import { RefreshToken } from "./refreshToken";
import { Service } from "./service";
import { Appointment } from "./appointment";
import { WorkingHours } from "./workingHours";
import { BlockedSlot } from "./blockedSlot";

export function applyAssociations(): void {
  // Category - Subcategory - Product
  Category.hasMany(Subcategory, {
    foreignKey: "categoryId",
    as: "subcategories",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
  });
  Category.hasMany(Product, {
    foreignKey: "categoryId",
    as: "products",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  Subcategory.belongsTo(Category, {
    foreignKey: "categoryId",
    as: "category",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Subcategory.hasMany(Product, {
    foreignKey: "subcategoryId",
    as: "products",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  Product.belongsTo(Category, {
    foreignKey: "categoryId",
    as: "category",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
  Product.belongsTo(Subcategory, {
    foreignKey: "subcategoryId",
    as: "subcategory",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // Customer - Order
  Customer.hasMany(Order, { foreignKey: "customerId", as: "orders" });
  Order.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

  // Order - Product (many-to-many through OrderProduct)
  Product.belongsToMany(Order, {
    through: OrderProduct,
    foreignKey: "productId",
    otherKey: "orderId",
    as: "orders",
  });
  Order.belongsToMany(Product, {
    through: OrderProduct,
    foreignKey: "orderId",
    otherKey: "productId",
    as: "products",
  });

  OrderProduct.belongsTo(Order, { foreignKey: "orderId", as: "orders" });
  Order.hasMany(OrderProduct, { foreignKey: "orderId", as: "orderProducts" });

  Category.belongsTo(User, { foreignKey: "userId", as: "users" });
  User.hasMany(Category, { foreignKey: "userId", as: "categories" });

  Customer.belongsTo(User, { foreignKey: "userId", as: "users" });
  User.hasMany(Customer, { foreignKey: "userId", as: "customers" });

  Order.belongsTo(User, { foreignKey: "userId", as: "users" });
  User.hasMany(Order, { foreignKey: "userId", as: "orders" });

  OrderProduct.belongsTo(Product, { foreignKey: "productId", as: "product" });
  Product.hasMany(OrderProduct, {
    foreignKey: "productId",
    as: "orderProducts",
  });

  Product.belongsTo(User, { foreignKey: "userId", as: "users" });
  User.hasMany(Product, { foreignKey: "userId", as: "products" });

  // Cart
  Cart.hasMany(CartProduct, { foreignKey: "cartId", as: "cartProducts" });
  CartProduct.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });

  Product.hasMany(CartProduct, { foreignKey: "productId", as: "cartProducts" });
  CartProduct.belongsTo(Product, { foreignKey: "productId", as: "product" });

  Customer.hasMany(Cart, { foreignKey: "customerId", as: "carts" });
  Cart.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

  // Address / BankCard
  Customer.hasMany(Address, { foreignKey: "customerId", as: "addresses" });
  Address.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

  Customer.hasMany(BankCard, { foreignKey: "customerId", as: "bankCards" });
  BankCard.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

  // Shipping
  Category.hasMany(Shipping, {
    foreignKey: "categoryId",
    as: "shippings",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
  Shipping.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

  Product.hasMany(Shipping, {
    foreignKey: "productId",
    as: "shippings",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
  Shipping.belongsTo(Product, { foreignKey: "productId", as: "product" });

  // User - Permission (many-to-many through UserPermission)
  User.belongsToMany(Permission, {
    through: UserPermission,
    foreignKey: "userId",
    as: "permissions",
  });
  Permission.belongsToMany(User, {
    through: UserPermission,
    foreignKey: "permissionId",
    as: "users",
  });

  // Component - Permission (many-to-many through ComponentPermission)
  Component.belongsToMany(Permission, {
    through: ComponentPermission,
    foreignKey: "componentId",
    otherKey: "permissionId",
    as: "permissions",
  });
  Permission.belongsToMany(Component, {
    through: ComponentPermission,
    foreignKey: "permissionId",
    otherKey: "componentId",
    as: "components",
  });

  Permission.hasMany(UserPermission, {
    foreignKey: "permissionId",
    as: "userPermissions",
  });
  UserPermission.belongsTo(Permission, {
    foreignKey: "permissionId",
    as: "permission",
  });

  Permission.hasMany(ComponentPermission, {
    foreignKey: "permissionId",
    as: "componentPermissions",
  });
  ComponentPermission.belongsTo(Permission, {
    foreignKey: "permissionId",
    as: "permission",
  });

  Component.hasMany(ComponentPermission, {
    foreignKey: "componentId",
    as: "componentPermissions",
  });
  ComponentPermission.belongsTo(Component, {
    foreignKey: "componentId",
    as: "component",
  });

  // RefreshToken
  Customer.hasMany(RefreshToken, { foreignKey: "customerId" });
  RefreshToken.belongsTo(Customer, { foreignKey: "customerId" });

  // Schedule
  User.hasMany(Service, { foreignKey: "userId", as: "services" });
  Service.belongsTo(User, { foreignKey: "userId", as: "user" });

  User.hasMany(Appointment, { foreignKey: "userId", as: "appointments" });
  Appointment.belongsTo(User, { foreignKey: "userId", as: "user" });

  Service.hasMany(Appointment, { foreignKey: "serviceId", as: "appointments" });
  Appointment.belongsTo(Service, { foreignKey: "serviceId", as: "service" });

  User.hasMany(WorkingHours, { foreignKey: "userId", as: "workingHours" });
  WorkingHours.belongsTo(User, { foreignKey: "userId", as: "user" });

  User.hasMany(BlockedSlot, { foreignKey: "userId", as: "blockedSlots" });
  BlockedSlot.belongsTo(User, { foreignKey: "userId", as: "user" });

  // Hooks
  Category.beforeDestroy(async (category, options) => {
    console.log(`Deleting category with ID: ${category.categoryId}`);
    await Subcategory.destroy({
      where: { categoryId: category.categoryId },
      force: true,
      ...options,
    });
    await Product.update(
      { categoryId: null },
      { where: { categoryId: category.categoryId }, ...options },
    );
  });

  Subcategory.beforeDestroy(async (subcategory, options) => {
    console.log(`Deleting subcategory with ID: ${subcategory.subcategoryId}`);
    await Product.update(
      { subcategoryId: null },
      { where: { subcategoryId: subcategory.subcategoryId }, ...options },
    );
  });
}
