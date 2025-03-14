const express = require('express');
const { getAllProducts } = require('../controllers/websiteController');
const router = express.Router();

router.get('/products/', getAllProducts);

module.exports = router;