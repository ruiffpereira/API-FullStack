const express = require('express');
const { loginCustomer } = require('../controllers/customerController');
const router = express.Router();

router.post('/', loginCustomer);

module.exports = router;
