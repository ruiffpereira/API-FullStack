const express = require('express');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../../../controllers/backoffice/ecommerce/productController');

const router = express.Router();

router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/',  updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;