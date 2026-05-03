"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("BankCards", "cvv");
    await queryInterface.renameColumn("BankCards", "cardNumber", "lastFourDigits");
    await queryInterface.changeColumn("BankCards", "lastFourDigits", {
      type: Sequelize.STRING(4),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn("BankCards", "lastFourDigits", "cardNumber");
    await queryInterface.changeColumn("BankCards", "cardNumber", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("BankCards", "cvv", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "",
    });
  },
};
