// const { where } = require('sequelize');
const { Product , Category, Subcategory} = require('../models');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAndCountAll({
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
  try {
    const product = await Product.findOne({
      where: {productId : req.params.id},
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
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'An error occurred while creating the product' });
  }
};

const updateProduct = async (req, res) => {
  
  if (req.method !== 'PATCH') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { id }= req.params;
  const fields = req.body;
  
  if (!id) {
    return res.status(400).json({ message: 'ID é necessário' });
  }

  try {
    const validFields = {};
    const updatableFields = ['name', 'reference', 'stock', 'description', 'categoryId', "subcategoryId"];

    updatableFields.forEach((field) => {
      if (fields[field] !== undefined) {
        validFields[field] = fields[field];
      }
    });

    if (validFields.stock !== undefined && isNaN(validFields.stock)) {
      return res.status(400).json({ message: 'Stock deve ser um número' });
    }

    const product = await Product.update(validFields, {
      where: { productId: id }
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
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
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
