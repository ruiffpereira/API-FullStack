const { Subcategory } = require('../models');

const getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.findAll();
    res.json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ error: 'An error occurred while fetching subcategories' });
  }
};

const getSubcategoryById = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByPk(req.params.id);
    if (subcategory) {
      res.json(subcategory);
    } else {
      res.status(404).json({ error: 'Subcategory not found' });
    }
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    res.status(500).json({ error: 'An error occurred while fetching the subcategory' });
  }
};

const createSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.create(req.body);
    res.status(201).json(subcategory);
  } catch (error) {
    console.error('Error creating subcategory:', error);
    res.status(500).json({ error: 'An error occurred while creating the subcategory' });
  }
};

const updateSubcategory = async (req, res) => {
  try {
    const [updated] = await Subcategory.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedSubcategory = await Subcategory.findByPk(req.params.id);
      res.json(updatedSubcategory);
    } else {
      res.status(404).json({ error: 'Subcategory not found' });
    }
  } catch (error) {
    console.error('Error updating subcategory:', error);
    res.status(500).json({ error: 'An error occurred while updating the subcategory' });
  }
};

const deleteSubcategory = async (req, res) => {
  try {
    const deleted = await Subcategory.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).json();
    } else {
      res.status(404).json({ error: 'Subcategory not found' });
    }
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res.status(500).json({ error: 'An error occurred while deleting the subcategory' });
  }
};

module.exports = {
  getAllSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};
