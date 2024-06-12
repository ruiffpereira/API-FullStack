const applyAssociations = (sequelize) => {
    const { Category, Subcategory, Product, Customer, Order, OrderProduct , User, Permission, UserPermission} = sequelize.models;
    
    // Associações de Category Subcategory Product
    Category.hasMany(Subcategory, { foreignKey: 'categoryId', as: 'subcategories' });
    Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });

    Subcategory.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
    Subcategory.hasMany(Product, { foreignKey: 'subcategoryId', as: 'products' });

    Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
    Product.belongsTo(Subcategory, { foreignKey: 'subcategoryId', as: 'subcategory' });

    // Associações de Customer Order
    Customer.hasMany(Order, { foreignKey: 'customerId', as: 'orders' });
    Order.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

    // Associações de User Permission
    User.belongsToMany(Permission, { through: UserPermission, foreignKey: 'userId', as: 'permissions' });
    Permission.belongsToMany(User, { through: UserPermission, foreignKey: 'permissionId', as: 'users' });
    
    // Associações de OrderProduct
    Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'productId', otherKey: 'orderId', as: 'orders' });
    Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'orderId', otherKey: 'productId', as: 'products' });

  };
  
  module.exports = applyAssociations;
  