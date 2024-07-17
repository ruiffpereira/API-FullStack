module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    productId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    photos: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Categories',
        key: 'categoryId'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
    subcategoryId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Subcategories',
        key: 'subcategoryId'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    },
  }, {
    paranoid: true,
  });
  return Product
};
