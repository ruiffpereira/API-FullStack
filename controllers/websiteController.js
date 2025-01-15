const { Product , User, Category, Subcategory} = require('../models');


const getAllProducts = async (req, res) => {
  try {
    // Obter a secretkey do cabeçalho da requisição
    const secretkey = req.headers['secretkey'];
    console.log('secretkey:', secretkey);

    if (!secretkey) {
      return res.status(400).json({ error: 'Secret key is required' });
    }

    // Encontrar o userId correspondente à secretkey
    const user = await User.findOne({
      where: { secretkeysite: secretkey }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found for the given secret key' });
    }
    
    // Buscar os produtos associados ao userId
    const products = await Product.findAll({
      where: { userId: user.userId }
    });

    
    console.log('products:', products);

    // Retornar os produtos na resposta
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'An error occurred while fetching the products' });
  }
};

module.exports = {
  getAllProducts,
};
