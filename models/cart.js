module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
      cartId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      customerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Customers',
          key: 'customerId',
        },
      },
    },
    {
      sequelize,
      modelName: 'Cart',
      tableName: 'Carts',
      timestamps: true,
    }
  );

  return Cart;
};