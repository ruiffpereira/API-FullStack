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
const router = express.Router();

router.use('/categories', categoryRoutes);
router.use('/subcategories', subcategoryRoutes);
router.use('/products', productRoutes);
router.use('/customers', customerRoutes);
router.use('/orders', orderRoutes);
router.use('/ordersProduct', orderProductRoutes);
router.use('/users', userRoutes);
router.use('/permissions', permissionRoutes);
router.use('/userpermissions', userPermissionRoutes);

module.exports = router;
