"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove unique constraint/index from 'email' in 'Customers' table
    await queryInterface.removeIndex("Customers", ["email"]).catch(() => {});
    await queryInterface.changeColumn("Customers", "email", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Add unique constraint/index back to 'email'
    await queryInterface.changeColumn("Customers", "email", {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    });
    await queryInterface.addIndex("Customers", ["email"], {
      unique: true,
      name: "customers_email",
    });
  },
};
