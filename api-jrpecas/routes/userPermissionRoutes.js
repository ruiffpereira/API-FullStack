const express = require('express');
const router = express.Router();
const userPermissionController = require('../controllers/userPermissionController');

// Rota para atribuir uma permissão a um usuário
router.post('/', userPermissionController.assignPermissionToUser);

module.exports = router;
