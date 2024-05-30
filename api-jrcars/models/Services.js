const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const Services = sequelize.define(
  "Services",
  {
    service: {
      type: DataTypes.STRING,
      allowNull: false,
      Validate: {
        notEmpty: true,
      },
    },
    time: {
      type: DataTypes.STRING,
      allowNull: false,
      Validate: {
        notEmpty: true,
      },
    },
    price: {
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

module.exports = Services;
