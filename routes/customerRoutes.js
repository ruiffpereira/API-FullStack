const express = require('express');
const { loginCustomer, getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer,} = require('../controllers/customerController.js');
const router = express.Router();
const { authenticateToken, authorizePermissions } = require('../src/middleware/auth');

router.post('/login', loginCustomer);
router.get('/', authenticateToken, authorizePermissions(['VIEW_CUSTOMERS']), getAllCustomers);
router.get('/:id',authenticateToken, authorizePermissions(['VIEW_CUSTOMERS']), getCustomerById);
router.post('/', authenticateToken, authorizePermissions(['VIEW_CUSTOMERS']),createCustomer);
router.put('/:id', authenticateToken, authorizePermissions(['VIEW_CUSTOMERS']),updateCustomer);
router.delete('/:id', authenticateToken, authorizePermissions(['VIEW_CUSTOMERS']),deleteCustomer);

module.exports = router;
