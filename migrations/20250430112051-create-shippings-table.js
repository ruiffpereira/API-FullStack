'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Shippings', {
      shippingId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      categoryId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Categories',
          key: 'categoryId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Products',
          key: 'productId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Shippings');
  },
};