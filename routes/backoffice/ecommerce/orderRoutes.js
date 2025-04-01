const express = require('express');
const { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder, getOrderByCustomerId } = require('../../../controllers/backoffice/ecommerce/orderController');
const router = express.Router();

router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.get('/customerid/:id', getOrderByCustomerId);
router.post('/', createOrder);
router.put('/:id', updateOrder);
router.delete('/:id', deleteOrder);

module.exports = router;
