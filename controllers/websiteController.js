const { Product , User, Category, Subcategory} = require('../models');


const getAllProducts = async (req, res) => {
  try {
    // Obter a secretkey do cabeçalho da requisição
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(400).json({ error: 'Secret key is required' });
    }

    // Encontrar o userId correspondente à secretkey
    const user = await User.findOne({
      where: { secretkeysite: token }
    });


    if (!user) {
      return res.status(404).json({ error: 'User not found for the given secret key' });
    }
    
    // Buscar os produtos associados ao userId
    const products = await Product.findAll({
      where: { userId: user.userId },
      attributes: ['productId', 'name', 'price', 'photos', 'description'] ,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['categoryId','name'] // Especifique os atributos desejados para Category
        },
        {
          model: Subcategory,
          as: 'subcategory',
          attributes: ['subCategoryId', 'name'] // Especifique os atributos desejados para Subcategory
        }
      ]
    });
    
    //console.log('products:', products);

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'An error occurred while fetching the products' });
  }
};

module.exports = {
  getAllProducts,
};
