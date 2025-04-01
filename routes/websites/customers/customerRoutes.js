const express = require('express');
const { loginCustomer, updateCustomer} = require('../../../controllers/websites/customers/customerController');
const router = express.Router();
const { authenticateToken, authorizePermissions } = require('../../../src/middleware/auth');

router.post('/login', loginCustomer);
// router.put('/:id', authenticateToken, authorizePermissions(['VIEW_CUSTOMERS']),updateCustomer);

module.exports = router;
