'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Shippings', 'title', {
      type: Sequelize.STRING,
      allowNull: false, // O título é obrigatório
    });

    await queryInterface.addColumn('Shippings', 'description', {
      type: Sequelize.TEXT,
      allowNull: true, // A descrição é opcional
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Shippings', 'title');
    await queryInterface.removeColumn('Shippings', 'description');
  },
};