"use strict";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const hashedPassword = await bcrypt.hash("password", 10);

    // Users
    const userId1 = uuidv4();
    const userId2 = uuidv4();
    await queryInterface.bulkInsert("Users", [
      {
        userId: userId1,
        name: "Admin",
        password: hashedPassword,
        email: "admin@example.com",
        createdAt: now,
        updatedAt: now,
      },
      {
        userId: userId2,
        name: "User",
        password: hashedPassword,
        email: "user@example.com",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // Permissions
    const permissionId1 = uuidv4();
    const permissionId2 = uuidv4();
    await queryInterface.bulkInsert("Permissions", [
      {
        permissionId: permissionId1,
        name: "Admin",
        description: "Administrator permission",
        createdAt: now,
        updatedAt: now,
      },
      {
        permissionId: permissionId2,
        name: "User",
        description: "User permission",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // UserPermissions
    await queryInterface.bulkInsert("UserPermissions", [
      {
        userId: userId1,
        permissionId: permissionId1,
        createdAt: now,
        updatedAt: now,
      },
      {
        userId: userId2,
        permissionId: permissionId2,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // Categories
    const electronicsId = uuidv4();
    const clothingId = uuidv4();
    const homeId = uuidv4();
    const sportsId = uuidv4();
    const booksId = uuidv4();
    await queryInterface.bulkInsert("Categories", [
      {
        categoryId: electronicsId,
        name: "Electronics",
        userId: userId1,
        createdAt: now,
        updatedAt: now,
      },
      {
        categoryId: clothingId,
        name: "Clothing",
        userId: userId1,
        createdAt: now,
        updatedAt: now,
      },
      {
        categoryId: homeId,
        name: "Home",
        userId: userId1,
        createdAt: now,
        updatedAt: now,
      },
      {
        categoryId: sportsId,
        name: "Sports",
        userId: userId2,
        createdAt: now,
        updatedAt: now,
      },
      {
        categoryId: booksId,
        name: "Books",
        userId: userId2,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // Subcategories
    const smartphonesId = uuidv4();
    const laptopsId = uuidv4();
    const menClothingId = uuidv4();
    const kitchenId = uuidv4();
    const fictionId = uuidv4();
    await queryInterface.bulkInsert("Subcategories", [
      {
        subcategoryId: smartphonesId,
        name: "Smartphones",
        categoryId: electronicsId,
        createdAt: now,
        updatedAt: now,
      },
      {
        subcategoryId: laptopsId,
        name: "Laptops",
        categoryId: electronicsId,
        createdAt: now,
        updatedAt: now,
      },
      {
        subcategoryId: menClothingId,
        name: "Men Clothing",
        categoryId: clothingId,
        createdAt: now,
        updatedAt: now,
      },
      {
        subcategoryId: kitchenId,
        name: "Kitchen",
        categoryId: homeId,
        createdAt: now,
        updatedAt: now,
      },
      {
        subcategoryId: fictionId,
        name: "Fiction",
        categoryId: booksId,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // Products
    const product1Id = uuidv4();
    const product2Id = uuidv4();
    const product3Id = uuidv4();
    const product4Id = uuidv4();
    const product5Id = uuidv4();
    await queryInterface.bulkInsert("Products", [
      {
        productId: product1Id,
        name: "iPhone 12",
        reference: "IP12",
        stock: 100,
        price: 799.99,
        description: "Latest Apple iPhone",
        photos: JSON.stringify(["photo1.jpg"]),
        categoryId: electronicsId,
        subcategoryId: smartphonesId,
        userId: userId1,
        createdAt: now,
        updatedAt: now,
      },
      {
        productId: product2Id,
        name: "MacBook Pro",
        reference: "MBP",
        stock: 50,
        price: 1299.99,
        description: "Apple MacBook Pro",
        photos: JSON.stringify(["photo2.jpg"]),
        categoryId: electronicsId,
        subcategoryId: laptopsId,
        userId: userId1,
        createdAt: now,
        updatedAt: now,
      },
      {
        productId: product3Id,
        name: "T-Shirt",
        reference: "TSHIRT",
        stock: 200,
        price: 19.99,
        description: "Comfortable cotton t-shirt",
        photos: JSON.stringify(["photo3.jpg"]),
        categoryId: clothingId,
        subcategoryId: menClothingId,
        userId: userId1,
        createdAt: now,
        updatedAt: now,
      },
      {
        productId: product4Id,
        name: "Blender",
        reference: "BLND",
        stock: 80,
        price: 49.99,
        description: "Kitchen blender",
        photos: JSON.stringify(["photo4.jpg"]),
        categoryId: homeId,
        subcategoryId: kitchenId,
        userId: userId1,
        createdAt: now,
        updatedAt: now,
      },
      {
        productId: product5Id,
        name: "Harry Potter",
        reference: "HP",
        stock: 150,
        price: 9.99,
        description: "Harry Potter book",
        photos: JSON.stringify(["photo5.jpg"]),
        categoryId: booksId,
        subcategoryId: fictionId,
        userId: userId2,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // Customers
    const customerId1 = uuidv4();
    const customerId2 = uuidv4();
    await queryInterface.bulkInsert("Customers", [
      {
        customerId: customerId1,
        name: "John Doe",
        photo: "john.jpg",
        email: "john@example.com",
        contact: "1234567890",
        userId: userId1,
        createdAt: now,
        updatedAt: now,
      },
      {
        customerId: customerId2,
        name: "Jane Smith",
        photo: "jane.jpg",
        email: "jane@example.com",
        contact: "0987654321",
        userId: userId2,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // Orders
    const orderId1 = uuidv4();
    const orderId2 = uuidv4();
    await queryInterface.bulkInsert("Orders", [
      {
        orderId: orderId1,
        customerId: customerId1,
        userId: userId1,
        price: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        orderId: orderId2,
        customerId: customerId2,
        userId: userId2,
        price: 0,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // OrderProducts
    await queryInterface.bulkInsert("OrderProducts", [
      {
        orderproductId: uuidv4(),
        orderId: orderId1,
        productId: product1Id,
        quantity: 2,
        priceAtPurchase: 799.99,
        createdAt: now,
        updatedAt: now,
      },
      {
        orderproductId: uuidv4(),
        orderId: orderId1,
        productId: product2Id,
        quantity: 1,
        priceAtPurchase: 1299.99,
        createdAt: now,
        updatedAt: now,
      },
      {
        orderproductId: uuidv4(),
        orderId: orderId1,
        productId: product3Id,
        quantity: 3,
        priceAtPurchase: 19.99,
        createdAt: now,
        updatedAt: now,
      },
      {
        orderproductId: uuidv4(),
        orderId: orderId1,
        productId: product4Id,
        quantity: 1,
        priceAtPurchase: 49.99,
        createdAt: now,
        updatedAt: now,
      },
      {
        orderproductId: uuidv4(),
        orderId: orderId2,
        productId: product5Id,
        quantity: 2,
        priceAtPurchase: 9.99,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // Components
    const compAdminId = uuidv4();
    const compCustomerId = uuidv4();
    const compProductId = uuidv4();
    await queryInterface.bulkInsert("Components", [
      {
        componentId: compAdminId,
        name: "VIEW_ADMIN",
        createdAt: now,
        updatedAt: now,
      },
      {
        componentId: compCustomerId,
        name: "VIEW_CUSTOMERS",
        createdAt: now,
        updatedAt: now,
      },
      {
        componentId: compProductId,
        name: "VIEW_PRODUCTS",
        createdAt: now,
        updatedAt: now,
      },
    ]);

    // ComponentPermissions (User permission gets VIEW_CUSTOMERS + VIEW_PRODUCTS)
    await queryInterface.bulkInsert("ComponentPermissions", [
      {
        componentPermissionId: uuidv4(),
        componentId: compCustomerId,
        permissionId: permissionId2,
        createdAt: now,
        updatedAt: now,
      },
      {
        componentPermissionId: uuidv4(),
        componentId: compProductId,
        permissionId: permissionId2,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("OrderProducts", null, {});
    await queryInterface.bulkDelete("Orders", null, {});
    await queryInterface.bulkDelete("Customers", null, {});
    await queryInterface.bulkDelete("Products", null, {});
    await queryInterface.bulkDelete("Subcategories", null, {});
    await queryInterface.bulkDelete("Categories", null, {});
    await queryInterface.bulkDelete("UserPermissions", null, {});
    await queryInterface.bulkDelete("Permissions", null, {});
    await queryInterface.bulkDelete("Users", null, {});
    await queryInterface.bulkDelete("Components", null, {});
    await queryInterface.bulkDelete("ComponentPermissions", null, {});
  },
};
