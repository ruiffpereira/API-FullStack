const express = require('express');
const { addProductToCart, updateProductQuantityInCart,getCartItems } = require('../controllers/cartController.js');
const router = express.Router();

router.post('/', addProductToCart);
router.put('/', updateProductQuantityInCart);
router.get('/', getCartItems);

module.exports = router;
