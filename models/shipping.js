module.exports = (sequelize, DataTypes) => {
  const Shipping = sequelize.define('Shipping', {
      shippingId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false, 
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true, 
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.UUID,
        allowNull: true, // Pode ser nulo se o porte não estiver associado a uma categoria
        references: {
          model: 'Categories', // Nome da tabela de categorias
          key: 'categoryId',
        },
      },
      productId: {
        type: DataTypes.UUID,
        allowNull: true, // Pode ser nulo se o porte não estiver associado a um produto específico
        references: {
          model: 'Products', // Nome da tabela de produtos
          key: 'productId',
        },
      },
    },
    {
      modelName: 'Shipping',
      tableName: 'Shippings',
      timestamps: true,
    }
  );

  return Shipping;
};