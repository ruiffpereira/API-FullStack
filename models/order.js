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
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'userId'
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
    price: {
      type: DataTypes.DECIMAL(10, 2), // Define o preço com até 10 dígitos e 2 casas decimais
      allowNull: false,
      defaultValue: 0.00, // Valor padrão
      validate: {
        isDecimal: true, // Garante que o valor seja decimal
        min: 0, // Garante que o preço não seja negativo
      },
    },
  });

  return Order;
};
