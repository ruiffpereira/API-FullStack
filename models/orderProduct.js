module.exports = (sequelize, DataTypes) => {
  const OrderProduct = sequelize.define('OrderProduct', {
    orderproductId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    orderId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'orderId',
      },
    },
    productId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: 'Products',
        key: 'ProductId',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId',
      },
    },
  },
  {
    paranoid: true,
  });

  return OrderProduct;
};
