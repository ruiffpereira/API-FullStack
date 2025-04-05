module.exports = (sequelize, DataTypes) => {
  const Address = sequelize.define('Address', {
    addressId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    nif: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    addTaxpayer: {
      type: DataTypes.BOOLEAN,
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
  }, {
    paranoid: true,
  });

  return Address;
};