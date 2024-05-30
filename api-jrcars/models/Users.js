const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const User = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      Validate: {
        notEmpty: true,
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      Validate: {
        notEmpty: true,
      },
    },
    contact: {
      type: DataTypes.INTEGER,
      allowNull: false,
      Validate: {
        notEmpty: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      Validate: {
        notEmpty: true,
      },
    },
    rule: {
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

module.exports = User;
