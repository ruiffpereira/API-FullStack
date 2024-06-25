const { Category, Subcategory } = require('../models');
const category = require('../models/category');

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAndCountAll({
      include: [
        { model: Subcategory , as: 'subcategories' }
      ]
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'An error occurred while fetching categories' });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'An error occurred while fetching the category' });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'An error occurred while creating the category' });
  }
};

const updateCategory = async (req, res) => {
  console.log("lol: ", req.body)
  try {
    const result = await Category.update({
      name : req.body.name,
    },
    {
      where: { categoryId: req.body.categoryId }
    });
    if (result) {
      const updatedCategory = await Category.findByPk(req.params.id);
      res.json(updatedCategory);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'An error occurred while updating the category' });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.destroy({
      where: { categoryId: req.params.id },
      force: true 
    });
    if (deleted) {
      //res.status(204).json();
      res.json(deleted);
    } else {
      res.status(404).json({ error: 'Category not found' });
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'An error occurred while deleting the category' });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
