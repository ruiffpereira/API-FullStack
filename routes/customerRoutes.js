const express = require('express');
const { getAllCustomers, getCustomerById, loginCustomer, updateCustomer, deleteCustomer } = require('../controllers/customerController');
const router = express.Router();
const { authenticateToken, authorizePermissions } = require('../src/middleware/auth');

router.get('/', authenticateToken, authorizePermissions(['VIEW_CUSTOMERS']), getAllCustomers);
router.get('/:id', authenticateToken, authorizePermissions(['VIEW_CUSTOMERS']), getCustomerById);
router.post('/', loginCustomer);
router.put('/:id', authenticateToken, authorizePermissions(['VIEW_CUSTOMERS']), updateCustomer);
router.delete('/:id', authenticateToken, authorizePermissions(['VIEW_CUSTOMERS']), deleteCustomer);

module.exports = router;
