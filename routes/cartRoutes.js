const express = require('express');
const { addProductToCart,getCartItems } = require('../controllers/cartController.js');
const router = express.Router();

router.post('/', addProductToCart);
router.get('/', getCartItems);

module.exports = router;
