'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {

    // Criar tabela Carts
    await queryInterface.createTable('Carts', {
      cartId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      customerId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Customers',
          key: 'customerId',
        },
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Criar tabela CartItems
    await queryInterface.createTable('CartProducts', {
      cartItemId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      cartId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Carts',
          key: 'cartId',
        },
      },
      productId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'productId',
        },
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });


  },

  down: async (queryInterface, Sequelize) => {

    // Adicionar coluna userId de volta à tabela Orders
    await queryInterface.addColumn('Orders', 'userId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId',
      },
    });

    // Adicionar coluna userId de volta à tabela OrderProducts
    await queryInterface.addColumn('OrderProducts', 'userId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId',
      },
    });

    await queryInterface.dropTable('OrderProducts');
    await queryInterface.dropTable('Orders');
    await queryInterface.dropTable('CartProducts');
    await queryInterface.dropTable('Carts');
  }
};