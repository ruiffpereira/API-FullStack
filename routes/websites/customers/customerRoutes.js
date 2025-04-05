const express = require('express');
const { loginCustomer, updateCustomer} = require('../../../controllers/websites/customers/customerController');
const router = express.Router();
const { authenticateToken, authorizePermissions } = require('../../../src/middleware/auth');

router.post('/', loginCustomer);

module.exports = router;
