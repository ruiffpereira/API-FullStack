const applyAssociations = (sequelize) => {
  const {
    Category,
    Subcategory,
    Product,
    Customer,
    Order,
    OrderProduct,
    User,
    Permission,
    UserPermission,
    Component,
    ComponentPermission,
    CartProduct,
    Cart,
    BankCard,
    Address,
    Shipping,
  } = sequelize.models;

  // Associações de Category Subcategory Product
  Category.hasMany(Subcategory, {
    foreignKey: "categoryId",
    as: "subcategories",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    hooks: true,
  });
  Category.hasMany(Product, {
    foreignKey: "categoryId",
    as: "products",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  Subcategory.belongsTo(Category, {
    foreignKey: "categoryId",
    as: "category",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  Subcategory.hasMany(Product, {
    foreignKey: "subcategoryId",
    as: "products",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  Product.belongsTo(Category, {
    foreignKey: "categoryId",
    as: "category",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
  Product.belongsTo(Subcategory, {
    foreignKey: "subcategoryId",
    as: "subcategory",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  // Associações de Customer Order
  Customer.hasMany(Order, { foreignKey: "customerId", as: "orders" });
  Order.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

  // Associações de OrderProduct
  Product.belongsToMany(Order, {
    through: OrderProduct,
    foreignKey: "productId",
    otherKey: "orderId",
    as: "orders",
  });
  Order.belongsToMany(Product, {
    through: OrderProduct,
    foreignKey: "orderId",
    otherKey: "productId",
    as: "products",
  });

  Category.belongsTo(User, { foreignKey: "userId", as: "users" });
  User.hasMany(Category, { foreignKey: "userId", as: "categories" });

  Customer.belongsTo(User, { foreignKey: "userId", as: "users" });
  User.hasMany(Customer, { foreignKey: "userId", as: "customers" });

  Order.belongsTo(User, { foreignKey: "userId", as: "users" });
  User.hasMany(Order, { foreignKey: "userId", as: "orders" });

  OrderProduct.belongsTo(User, { foreignKey: "userId", as: "users" });
  User.hasMany(OrderProduct, { foreignKey: "userId", as: "orderproducts" });

  Product.belongsTo(User, { foreignKey: "userId", as: "users" });
  User.hasMany(Product, { foreignKey: "userId", as: "products" });

  // Associações entre Cart e CartProduct
  Cart.hasMany(CartProduct, { foreignKey: "cartId", as: "cartProducts" });
  CartProduct.belongsTo(Cart, { foreignKey: "cartId", as: "cart" });

  // Associações entre Product e CartProduct
  Product.hasMany(CartProduct, { foreignKey: "productId", as: "cartProducts" });
  CartProduct.belongsTo(Product, { foreignKey: "productId", as: "product" });

  // Associações entre Customer e Cart
  Customer.hasMany(Cart, { foreignKey: "customerId", as: "carts" });
  Cart.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

  // Associações entre Customer e Address
  Customer.hasMany(Address, { foreignKey: "customerId", as: "addresses" });
  Address.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

  // Associações entre Customer e BankCard
  Customer.hasMany(BankCard, { foreignKey: "customerId", as: "bankCards" });
  BankCard.belongsTo(Customer, { foreignKey: "customerId", as: "customer" });

  // Associações entre Category e Shipping
  Category.hasMany(Shipping, {
    foreignKey: "categoryId",
    as: "shippings",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });
  Shipping.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

  // Associações entre Product e Shipping
  Product.hasMany(Shipping, {
    foreignKey: "productId",
    as: "shippings",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  });

  Shipping.belongsTo(Product, { foreignKey: "productId", as: "product" });

  // Associações de User Permission
  User.belongsToMany(Permission, {
    through: UserPermission,
    foreignKey: "userId",
    as: "permissions",
  });
  Permission.belongsToMany(User, {
    through: UserPermission,
    foreignKey: "permissionId",
    as: "users",
  });

  Component.belongsToMany(Permission, {
    through: ComponentPermission,
    foreignKey: "componentId",
    otherKey: "permissionId",
    as: "permissions",
  });

  Permission.belongsToMany(Component, {
    through: ComponentPermission,
    foreignKey: "permissionId",
    otherKey: "componentId",
    as: "components",
  });

  // Associações entre Permission e UserPermission
  Permission.hasMany(UserPermission, {
    foreignKey: "permissionId",
    as: "userPermissions",
  });
  UserPermission.belongsTo(Permission, {
    foreignKey: "permissionId",
    as: "permission",
  });

  // Associações entre Permission e ComponentPermission
  Permission.hasMany(ComponentPermission, {
    foreignKey: "permissionId",
    as: "componentPermissions",
  });
  ComponentPermission.belongsTo(Permission, {
    foreignKey: "permissionId",
    as: "permission",
  });

  // Associações entre Component e ComponentPermission
  Component.hasMany(ComponentPermission, {
    foreignKey: "componentId",
    as: "componentPermissions",
  });
  ComponentPermission.belongsTo(Component, {
    foreignKey: "componentId",
    as: "component",
  });

  // Definindo Hooks
  Category.beforeDestroy(async (category, options) => {
    console.log(`Deleting category with ID: ${category.categoryId}`);
    // Exclui todas as subcategorias associadas em cascata
    await Subcategory.destroy({
      where: {
        categoryId: category.categoryId,
      },
      force: true, // Força a exclusão física, mesmo com paranoid: true
      ...options,
    });

    // Define o campo categoryId como nulo em todos os produtos associados
    await Product.update(
      { categoryId: null },
      {
        where: {
          categoryId: category.categoryId,
        },
        ...options,
      }
    );
  });

  Subcategory.beforeDestroy(async (subcategory, options) => {
    console.log(`Deleting subcategory with ID: ${subcategory.subcategoryId}`);
    // Define o campo subcategoryId como nulo em todos os produtos associados
    await Product.update(
      { subcategoryId: null },
      {
        where: {
          subcategoryId: subcategory.subcategoryId,
        },
        ...options,
      }
    );
  });
};

module.exports = applyAssociations;
