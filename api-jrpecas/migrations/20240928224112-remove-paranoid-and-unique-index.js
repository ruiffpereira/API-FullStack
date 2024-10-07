'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remover o comportamento paranoid
    await queryInterface.changeColumn('Users', 'deletedAt', {
      allowNull: true,
      type: Sequelize.DATE,
    });

    // Remover o índice único
    await queryInterface.removeIndex('Users', 'unique_email');
  },

  down: async (queryInterface, Sequelize) => {
    // Adicionar novamente o comportamento paranoid
    await queryInterface.changeColumn('Users', 'deletedAt', {
      allowNull: true,
      type: Sequelize.DATE,
      defaultValue: null,
    });

    // Adicionar novamente o índice único
    await queryInterface.addIndex('Users', ['email'], {
      unique: true,
      name: 'unique_email',
    });
  }
};