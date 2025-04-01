const express = require('express');
const { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } = require('../../../controllers/backoffice/ecommerce/categoryController');
const router = express.Router();

router.get('/', getAllCategories);
router.get('/:id', getCategoryById);
router.post('/', createCategory);
router.put('/', updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
