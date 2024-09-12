const { Sequelize , DataTypes } = require("sequelize");
require("dotenv").config();
const applyAssociations = require('./associations');
const fs = require('fs');
const configPath = './config.json';
const rawData = fs.readFileSync(configPath);
const config = JSON.parse(rawData);

// Determinar o ambiente atual baseado em NODE_ENV ou usar 'development' como padrão
const environment = process.env.NODE_ENV || 'development';

// Selecionar a configuração baseada no ambiente
const dbConfig = config[environment];

// Configurar o Sequelize com as configurações do ambiente
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    logging: false,
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    // retry: {
    //   max: 10, // Número máximo de tentativas de reconexão
    //   timeout: 5000, // Tempo de espera entre as tentativas, em milissegundos
    //   match: [
    //     Sequelize.ConnectionError,
    //     Sequelize.ConnectionRefusedError,
    //     Sequelize.ConnectionTimedOutError,
    //     Sequelize.TimeoutError
    //   ], // Lista de erros específicos que devem ser considerados para reconexão
    // },
  },
);

const Customer = require('./customer')(sequelize, DataTypes);
const Category = require('./category')(sequelize, DataTypes);
const Subcategory = require('./subcategory')(sequelize, DataTypes);
const Product = require('./product')(sequelize, DataTypes);
const Order = require('./order')(sequelize, DataTypes);
const OrderProduct = require('./orderProduct')(sequelize, DataTypes);
const User = require('./user')(sequelize, DataTypes);
const Permission = require('./permission')(sequelize, DataTypes);
const UserPermission = require('./userPermission')(sequelize, DataTypes);

const seedDatabase = async () => {
  try {

    console.log("teste")
    // Categories
    const electronics = await Category.create({ name: 'Electronics' });
    const clothing = await Category.create({ name: 'Clothing' });
    const home = await Category.create({ name: 'Home' });
    const sports = await Category.create({ name: 'Sports' });
    const books = await Category.create({ name: 'Books' });

    // Subcategories
    const smartphones = await Subcategory.create({ name: 'Smartphones', categoryId: electronics.categoryId });
    const laptops = await Subcategory.create({ name: 'Laptops', categoryId: electronics.categoryId });
    const menClothing = await Subcategory.create({ name: 'Men Clothing', categoryId: clothing.categoryId });
    const kitchen = await Subcategory.create({ name: 'Kitchen', categoryId: home.categoryId });
    const fiction = await Subcategory.create({ name: 'Fiction', categoryId: books.categoryId });

    // Products
    const product1 = await Product.create({ name: 'iPhone 12', reference: 'IP12', stock: 100, price: 799.99, description: 'Latest Apple iPhone', photos: [], categoryId: electronics.categoryId, subcategoryId: smartphones.subcategoryId });
    const product2 = await Product.create({ name: 'MacBook Pro', reference: 'MBP', stock: 50, price: 1299.99, description: 'Apple MacBook Pro', photos: [], categoryId: electronics.categoryId, subcategoryId: laptops.subcategoryId });
    const product3 = await Product.create({ name: 'T-Shirt', reference: 'TSHIRT', stock: 200, price: 19.99, description: 'Comfortable cotton t-shirt', photos: [], categoryId: clothing.categoryId, subcategoryId: menClothing.subcategoryId });
    const product4 = await Product.create({ name: 'Blender', reference: 'BLND', stock: 80, price: 49.99, description: 'Kitchen blender', photos: [], categoryId: home.categoryId, subcategoryId: kitchen.subcategoryId });
    const product5 = await Product.create({ name: 'Harry Potter', reference: 'HP', stock: 150, price: 9.99, description: 'Harry Potter book', photos: [], categoryId: books.categoryId, subcategoryId: fiction.subcategoryId });

    // Customers
    const customer1 = await Customer.create({ name: 'John Doe', photo: 'john.jpg', email: 'john@example.com', contact: '1234567890' });
    const customer2 = await Customer.create({ name: 'Jane Smith', photo: 'jane.jpg', email: 'jane@example.com', contact: '0987654321' });

    // Orders
    const order1 = await Order.create({ customerId: customer1.customerId });
    const order2 = await Order.create({ customerId: customer2.customerId });

    // Order Products
    await OrderProduct.create({ orderId: order1.orderId, productId: product1.productId, quantity: 2 });
    await OrderProduct.create({ orderId: order1.orderId, productId: product2.productId, quantity: 1 });
    await OrderProduct.create({ orderId: order2.orderId, productId: product3.productId, quantity: 3 });
    await OrderProduct.create({ orderId: order2.orderId, productId: product4.productId, quantity: 1 });
    await OrderProduct.create({ orderId: order2.orderId, productId: product5.productId, quantity: 2 });

    const user1 = await User.create({ username: 'admin', password: 'password', email: 'admin@example.com' });
    const user2 = await User.create({ username: 'user', password: 'password', email: 'user@example.com' });

    const permission1 = await Permission.create({ name: 'ADMIN', description: 'Administrator permission' });
    const permission2 = await Permission.create({ name: 'USER', description: 'User permission' });

    await UserPermission.create({ userId: user1.userId, permissionId: permission1.permissionId });
    await UserPermission.create({ userId: user2.userId, permissionId: permission2.permissionId });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } 
};

const startDB = async () => {
  try {
    // await sequelize.sync({ force: true });
    // await seedDatabase();
    sequelize.sync();
    //await sequelize.sync({ alter: true });
    applyAssociations(sequelize);
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = { 
  sequelize,
  Category,
  Subcategory,
  Product,
  Order,
  OrderProduct,
  Customer,
  User,
  Permission,
  UserPermission,
  startDB
 };
