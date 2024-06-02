const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const OrdersandProducts = sequelize.define(
  "OrdersandProducts",
  {
    productID: {
      type: DataTypes.STRING,
      allowNull: false,
      Validate: {
        notEmpty: true,
      },
    },
    orderID: {
      type: DataTypes.STRING,
      allowNull: false,
      Validate: {
        notEmpty: true,
      },
    },
    amount: {
      type: DataTypes.STRING,
      allowNull: false,
      Validate: {
        notEmpty: true,
      },
    },
  },
  {
    paranoid: true,
  }
);

module.exports = OrdersandProducts;
