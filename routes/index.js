
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
const componentsRoutes = require('./componentsRoutes');
const websiteRoutes = require('./websiteRoutes');

const { authenticateToken, authorizePermissions } = require('../src/middleware/auth');

const router = express.Router();

router.use('/categories', authenticateToken, authorizePermissions(['VIEW_PRODUCTS']) , categoryRoutes);
router.use('/subcategories', authenticateToken, authorizePermissions(['VIEW_PRODUCTS']), subcategoryRoutes);
router.use('/products',authenticateToken,  authorizePermissions(['VIEW_PRODUCTS']), productRoutes);
router.use('/customers', customerRoutes);
router.use('/orders',authenticateToken, authorizePermissions(['VIEW_ORDERS']), orderRoutes);
router.use('/ordersProduct',authenticateToken, authorizePermissions(['VIEW_ORDERS']), orderProductRoutes);
router.use('/users', userRoutes);
router.use('/permissions', authenticateToken, authorizePermissions(['VIEW_ADMIN']), permissionRoutes);
router.use('/userpermissions', authenticateToken, userPermissionRoutes);
router.use('/components', authenticateToken, authorizePermissions(['VIEW_ADMIN']), componentsRoutes);
router.use('/websites', websiteRoutes);

module.exports = router;
