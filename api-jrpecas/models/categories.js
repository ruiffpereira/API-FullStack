const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const Categories = sequelize.define(
  "Categories",
  {
    categoryID: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      Validate: {
        notEmpty: true,
      },
    },
    name: {
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

module.exports = Categories;
