const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const Clients = sequelize.define(
  "Clients",
  {
    clientID: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
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
    photo: {
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
    }
  },
  {
    paranoid: true,
  }
);

module.exports = Clients;
