
const express = require('express');
const categoryRoutes = require('./categoryRoutes');
const subcategoryRoutes = require('./subcategoryRoutes');
const productRoutes = require('./productRoutes');
const customerRoutes = require('./customerRoutes');
const orderRoutes = require('./orderRoutes');
const orderProductRoutes = require('./orderProductRoutes');
const userRoutes = require('./userRoutes');
const permissionRoutes = require('./permissionRoutes');
const userPermissionRoutes = require('./userPermissionRoutes');
const authenticateToken = require('../src/middleware/auth'); 
const router = express.Router();

router.use('/categories', authenticateToken, categoryRoutes);
router.use('/subcategories', authenticateToken, subcategoryRoutes);
router.use('/products', authenticateToken, productRoutes);
router.use('/customers', authenticateToken, customerRoutes);
router.use('/orders', authenticateToken, orderRoutes);
router.use('/ordersProduct', authenticateToken, orderProductRoutes);
router.use('/users', userRoutes);
router.use('/permissions', authenticateToken, permissionRoutes);
router.use('/userpermissions', authenticateToken, userPermissionRoutes);

module.exports = router;
