'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('OrderProducts', 'priceAtPurchase', {
      type: Sequelize.DECIMAL(10, 2), // Preço com até 10 dígitos e 2 casas decimais
      allowNull: false,
      defaultValue: 0.00, // Valor padrão
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('OrderProducts', 'priceAtPurchase');
  },
};