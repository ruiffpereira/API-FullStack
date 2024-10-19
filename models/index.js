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
const Component = require('./component')(sequelize, DataTypes);
const ComponentPermission = require('./componentPermission')(sequelize, DataTypes);

const startDB = async () => {
  try {
    // await sequelize.sync({ force: true });
    await sequelize.sync();
    // await sequelize.sync({ alter: true });
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
  Component,
  ComponentPermission,
  startDB
 };
