const seedDatabase = async () => {
  try {

    const user1 = await User.create({ username: 'Admin', password: 'password', email: 'admin@example.com' });
    const user2 = await User.create({ username: 'User', password: 'password', email: 'user@example.com' });

    // Permissions
    const permission1 = await Permission.create({ name: 'Admin', description: 'Administrator permission' });
    const permission2 = await Permission.create({ name: 'User', description: 'User permission' });

    await UserPermission.create({ userId: user1.id, permissionId: permission1.id });
    await UserPermission.create({ userId: user2.id, permissionId: permission2.id });

    // Categories
    const electronics = await Category.create({ name: 'Electronics', userId: user1.id });
    const clothing = await Category.create({ name: 'Clothing', userId: user1.id });
    const home = await Category.create({ name: 'Home' , userId: user1.id});
    const sports = await Category.create({ name: 'Sports', userId: user2.id });
    const books = await Category.create({ name: 'Books', userId: user2.id });

    // Subcategories
    const smartphones = await Subcategory.create({ name: 'Smartphones', categoryId: electronics.categoryId });
    const laptops = await Subcategory.create({ name: 'Laptops', categoryId: electronics.categoryId });
    const menClothing = await Subcategory.create({ name: 'Men Clothing', categoryId: clothing.categoryId });
    const kitchen = await Subcategory.create({ name: 'Kitchen', categoryId: home.categoryId });
    const fiction = await Subcategory.create({ name: 'Fiction', categoryId: books.categoryId });

    // Products
    const product1 = await Product.create({ name: 'iPhone 12', reference: 'IP12', stock: 100, price: 799.99, description: 'Latest Apple iPhone', photos: 'photo1.jpg', categoryId: electronics.categoryId, subcategoryId: smartphones.subcategoryId , userId: user1.id});
    const product2 = await Product.create({ name: 'MacBook Pro', reference: 'MBP', stock: 50, price: 1299.99, description: 'Apple MacBook Pro', photos: 'photo2.jpg', categoryId: electronics.categoryId, subcategoryId: laptops.subcategoryId, userId: user1.id });
    const product3 = await Product.create({ name: 'T-Shirt', reference: 'TSHIRT', stock: 200, price: 19.99, description: 'Comfortable cotton t-shirt', photos: 'photo3.jpg', categoryId: clothing.categoryId, subcategoryId: menClothing.subcategoryId , userId: user1.id});
    const product4 = await Product.create({ name: 'Blender', reference: 'BLND', stock: 80, price: 49.99, description: 'Kitchen blender', photos: 'photo4.jpg', categoryId: home.categoryId, subcategoryId: kitchen.subcategoryId, userId: user1.id });
    const product5 = await Product.create({ name: 'Harry Potter', reference: 'HP', stock: 150, price: 9.99, description: 'Harry Potter book', photos: 'photo5.jpg', categoryId: books.categoryId, subcategoryId: fiction.subcategoryId, userId: user2.id });

    // Customers
    const customer1 = await Customer.create({ name: 'John Doe', photo: 'john.jpg', email: 'john@example.com', contact: '1234567890', userId: user1.id });
    const customer2 = await Customer.create({ name: 'Jane Smith', photo: 'jane.jpg', email: 'jane@example.com', contact: '0987654321', userId: user2.id });

    // Orders
    const order1 = await Order.create({ customerId: customer1.customerId });
    const order2 = await Order.create({ customerId: customer2.customerId });

    // Order Products
    await OrderProduct.create({ orderId: order1.orderId, productId: product1.productId, quantity: 2, userId: user1.id });
    await OrderProduct.create({ orderId: order1.orderId, productId: product2.productId, quantity: 1, userId: user1.id});
    await OrderProduct.create({ orderId: order1.orderId, productId: product3.productId, quantity: 3 , userId: user1.id});
    await OrderProduct.create({ orderId: order1.orderId, productId: product4.productId, quantity: 1 , userId: user1.id});
    await OrderProduct.create({ orderId: order2.orderId, productId: product5.productId, quantity: 2, userId: user2.id });

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } 
};