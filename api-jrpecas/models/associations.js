const applyAssociations = (sequelize) => {
    const { Category, Subcategory, Product, Customer, Order, OrderProduct , User, Permission, UserPermission} = sequelize.models;
    
    // Associações de Category
    Category.hasMany(Subcategory, { foreignKey: 'categoryId', as: 'subcategories' });
    Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

    // Associações de Subcategory
    Subcategory.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
    Subcategory.hasMany(Product, { foreignKey: 'subcategoryId', as: 'products' });

    // Associações de Product
    Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
    Product.belongsTo(Subcategory, { foreignKey: 'subcategoryId', as: 'subcategory' });

    // Associações de Customer
    Customer.hasMany(Order, { foreignKey: 'customerId', as: 'orders' });

    // Associações de Order
    Order.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
    Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'orderId', as: 'products' });

    // Associações de OrderProduct
    OrderProduct.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
    OrderProduct.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

    // Associações de User
    User.belongsToMany(Permission, { through: UserPermission, foreignKey: 'userId', as: 'permissions' });

    // Associações de Permission
    Permission.belongsToMany(User, { through: UserPermission, foreignKey: 'permissionId', as: 'users' });

  };
  
  module.exports = applyAssociations;
  