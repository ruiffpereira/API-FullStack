module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    orderId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      Validate: {
        notEmpty: true,
      },
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Customers',
        key: 'customerId'
      },
    },
  });

  return Order;
};
