const express = require('express');
const { getOrderByCustomerId, getOrderByOrderId } = require('../../../controllers/backoffice/ecommerce/orderProductController');
const router = express.Router();

router.get('/:id', getOrderByCustomerId);
router.get('/orderid/:id', getOrderByOrderId);

module.exports = router;
