const applyAssociations = (sequelize) => {
    const { Category, Subcategory, Product, Customer, Order, OrderProduct , User, Permission, UserPermission} = sequelize.models;
    
    // Associações de Category Subcategory Product
    Category.hasMany(Subcategory, { foreignKey: 'categoryId', as: 'subcategories', onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true });
    Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products', onDelete: 'SET NULL', onUpdate: 'CASCADE'});
    
    Subcategory.belongsTo(Category, { foreignKey: 'categoryId', as: 'category',  onDelete: 'CASCADE', onUpdate: 'CASCADE' });
    Subcategory.hasMany(Product, { foreignKey: 'subcategoryId', as: 'products', onDelete: 'SET NULL', onUpdate: 'CASCADE'});
    
    Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category', onDelete: 'SET NULL', onUpdate: 'CASCADE'});
    Product.belongsTo(Subcategory, { foreignKey: 'subcategoryId', as: 'subcategory' , onDelete: 'SET NULL', onUpdate: 'CASCADE'});

    // Associações de Customer Order
    Customer.hasMany(Order, { foreignKey: 'customerId', as: 'orders' });
    Order.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

    // Associações de User Permission
    User.belongsToMany(Permission, { through: UserPermission, foreignKey: 'userId', as: 'permissions' });
    Permission.belongsToMany(User, { through: UserPermission, foreignKey: 'permissionId', as: 'users' });
    
    // Associações de OrderProduct
    Product.belongsToMany(Order, { through: OrderProduct, foreignKey: 'productId', otherKey: 'orderId', as: 'orders' });
    Order.belongsToMany(Product, { through: OrderProduct, foreignKey: 'orderId', otherKey: 'productId', as: 'products' });


    // Definindo Hooks
    Category.beforeDestroy(async (category, options) => {
      console.log(`Deleting category with ID: ${category.categoryId}`);
      // Exclui todas as subcategorias associadas em cascata
      await Subcategory.destroy({
        where: {
          categoryId: category.categoryId,
        },
        force: true,  // Força a exclusão física, mesmo com paranoid: true
        ...options,
      });

      // Define o campo categoryId como nulo em todos os produtos associados
      await Product.update({ categoryId: null }, {
        where: {
          categoryId: category.categoryId,
        },
        ...options,
      });
    });

    Subcategory.beforeDestroy(async (subcategory, options) => {
      console.log(`Deleting subcategory with ID: ${subcategory.subcategoryId}`);
      // Define o campo subcategoryId como nulo em todos os produtos associados
      await Product.update({ subcategoryId: null }, {
        where: {
          subcategoryId: subcategory.subcategoryId,
        },
        ...options,
      });
    });

  };
  
  module.exports = applyAssociations;
  