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
    priceAtPurchase: {
      type: DataTypes.DECIMAL(10, 2), // Preço com até 10 dígitos e 2 casas decimais
      allowNull: false,
    },
  },
  {
    paranoid: true,
  });

  return OrderProduct;
};
