const express = require('express');
const { getAllProducts } = require('../../../controllers/websites/ecommerce/productsController');
const router = express.Router();

router.get('/', getAllProducts);

module.exports = router;