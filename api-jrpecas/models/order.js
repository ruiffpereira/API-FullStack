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
    },
    // deliveryAddress: {
    //   type: DataTypes.STRING,
    //   allowNull: false
    // },
    // total: {
      //   type: DataTypes.STRING,
      //   allowNull: false
      // },
    // paymentMethod: {
    //   type: DataTypes.STRING,
    //   allowNull: false
    // },
    // trackingNumber: {
    //   type: DataTypes.STRING,
    //   allowNull: true
    // },
    // paidStatus: {
    //   type: DataTypes.STRING,
    //   allowNull: true
    // }
  });

  return Order;
};
