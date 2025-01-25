module.exports = (sequelize, DataTypes) => {
  const CartProduct = sequelize.define('CartProduct', {
      cartItemId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      cartId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Carts',
          key: 'cartId',
        },
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Products',
          key: 'productId',
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CartProduct',
      tableName: 'CartProducts',
      timestamps: true,
    }
  );

  return CartProduct;
};