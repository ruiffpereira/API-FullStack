// const { where } = require('sequelize');
const { Product , Category, Subcategory} = require('../models');
//const upload = require('../middleware/upload');

const getAllProducts = async (req, res) => {
  const userId = req.user;
  console.log("teste")
  try {
    const products = await Product.findAndCountAll({
      where: { userId },
      include: [
        { model: Category , as: 'category'},
        { model: Subcategory , as: 'subcategory' }
      ]
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'An error occurred while fetching products' });
  }
};

const getProductById = async (req, res) => {
  const userId = req.user;
  try {
    const product = await Product.findOne({
      where: {productId : req.params.id, userId},
      include: [
        { model: Category , as: 'category'},
        { model: Subcategory , as: 'subcategory' }
      ]
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'An error occurred while fetching the product' });
  }
};

const createProduct = async (req, res) => {

  const userId = req.user;
  const { productId, ...fields } = req.body;

  const validFields = {};
  const updatableFields = ['name', 'reference', 'stock', "price", 'description', 'categoryId', "subcategoryId"];

  updatableFields.forEach((field) => {
    if (fields[field] !== undefined && fields[field] !== '') {
      validFields[field] = fields[field];
    }
  });

  try {
    const newProduct = await Product.create(validFields, userId);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'An error occurred while creating the product' });
  }
};

const updateProduct = async (req, res) => {
  const userId = req.user;
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Método não permitido' });
  }
  const fields = req.body;
  

  if (!fields.productId) {
    return res.status(400).json({ message: 'ID é necessário' });
  }

  try {
    const validFields = {};
    const updatableFields = ['name', 'reference', 'stock', "price",'description', 'categoryId', "subcategoryId"];

    updatableFields.forEach((field) => {
      if (fields[field] !== undefined && fields[field] !== '') {
        validFields[field] = fields[field];
      }
    });

    if (validFields.stock !== undefined && isNaN(validFields.stock)) {
      return res.status(400).json({ message: 'Stock deve ser um número' });
    }
    console.log(fields)
    console.log(validFields)

    const product = await Product.update(validFields, {
      where: { productId: fields.productId, userId }
    });

    
    if (product[0] === 0) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.status(200).json({ message: 'Produto atualizado com sucesso' });
  } catch (error) {
    let errorMessage
    if (error.name === 'SequelizeForeignKeyConstraintError') {
      errorMessage = `Foreign key constraint error: ${error.message}`
    } else {
      errorMessage = `Error updating product category: ${error.message}`
    }
    res.status(500).json({ error: errorMessage , details: error.message });
    console.log("aqui: ", errorMessage)
  }
};

const deleteProduct = async (req, res) => {
  const userId = req.user;
  try {
    const deleted = await Product.destroy({
      where: { productId: req.params.id , userId}
    });
    if (deleted) {
      res.json({ deleted });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'An error occurred while deleting the product' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
