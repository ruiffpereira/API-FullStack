const express = require('express');
const { getAllCustomers, getCustomerById} = require('../../../controllers/backoffice/customers/customerController.js');
const { authenticateToken, authorizePermissions } = require('../../../src/middleware/auth.js');

const router = express.Router();

router.get('/', getAllCustomers);
router.get('/:id', getCustomerById);

module.exports = router;