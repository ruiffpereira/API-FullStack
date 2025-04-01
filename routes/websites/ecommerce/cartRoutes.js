const express = require('express');
const { addProductToCart,getCartItems } = require('../../../controllers/websites/ecommerce/cartController');
const router = express.Router();

router.post('/', addProductToCart);
router.get('/', getCartItems);

module.exports = router;
