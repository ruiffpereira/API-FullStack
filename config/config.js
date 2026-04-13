require("dotenv").config();

const env = process.env.ENVIROMENT;

console.log("=== DEBUG ===");
console.log("ENVIROMENT:", env);
console.log("DB_HOST_PROD:", process.env.DB_HOST_PROD);
console.log("DB_USERNAME_PROD:", process.env.DB_USERNAME_PROD);
console.log("DB_DATABASE_PROD:", process.env.DB_DATABASE_PROD);
console.log("DB_PORT_PROD:", process.env.DB_PORT_PROD);
console.log("DB_DIALECT_PROD:", process.env.DB_DIALECT_PROD);
console.log("=============");

const config = {
  DEV: {
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    database: process.env.DB_DATABASE_DEV,
    host: process.env.DB_HOST_DEV,
    port: process.env.DB_PORT_DEV,
    dialect: process.env.DB_DIALECT_DEV,
  },
  PROD: {
    username: process.env.DB_USERNAME_PROD,
    password: process.env.DB_PASSWORD_PROD,
    database: process.env.DB_DATABASE_PROD,
    host: process.env.DB_HOST_PROD,
    port: process.env.DB_PORT_PROD,
    dialect: process.env.DB_DIALECT_PROD,
  },
};

module.exports = config[env];
