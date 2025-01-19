module.exports = (sequelize, DataTypes) => {
  const Shopping_cart = sequelize.define('Shopping_cart', {
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'customerId'
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
  });

  return Shopping_cart;
};
