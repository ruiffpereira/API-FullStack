const express = require('express');
const { getAllSubcategories, getSubcategoryById, createSubcategory, updateSubcategory, deleteSubcategory } = require('../controllers/subcategoryController');
const router = express.Router();

router.get('/', getAllSubcategories);
router.get('/:id', getSubcategoryById);
router.post('/', createSubcategory);
router.put('/', updateSubcategory);
router.delete('/', deleteSubcategory);

module.exports = router;
