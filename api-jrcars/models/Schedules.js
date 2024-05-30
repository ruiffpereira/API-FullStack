const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const Schedule = sequelize.define(
  "schedule",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      Validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      Validate: {
        notEmpty: true,
      },
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false,
      Validate: {
        notEmpty: true,
      },
    },
    hours: {
      type: DataTypes.STRING,
      allowNull: false,
      Validate: {
        notEmpty: true,
      },
    },
    service: {
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

module.exports = Schedule;
