const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');

// Rota para listar todas as permissões
router.get('/', permissionController.getAllPermissions);

// Rota para criar uma nova permissão
router.post('/', permissionController.createPermission);

// Rota para atualizar permissão pelo ID
router.put('/:id', permissionController.updatePermissionById);

// Rota para obter uma permissão pelo ID
router.get('/:id', permissionController.getPermissionById);

router.delete('/:id', permissionController.deletePermissionById);

module.exports = router;
