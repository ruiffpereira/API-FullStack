const { Product , User, Category, Subcategory} = require('../../../models');


const getAllProducts = async (req, res) => {
  
  try {
    // Encontrar o userId correspondente à secretkey
    const user = await User.findOne({
      where: { userId: req.userId  }
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

/**
 * @swagger
 * tags:
 *   name: Website
 *   description: Management of website products and cart
 */

/**
 * @swagger
 * /websites/ecommerce/products:
 *   get:
 *     summary: Get all products for a website
 *     tags: [Website]
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         description: Secret key for the website
 *     responses:
 *       200:
 *         description: List of products for the website
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       400:
 *         description: Secret key is required
 *       404:
 *         description: User not found for the given secret key
 *       500:
 *         description: Error fetching products
 */