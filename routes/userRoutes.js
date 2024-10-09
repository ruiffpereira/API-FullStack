const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizePermissions } = require('../src/middleware/auth');

// Rota para listar todos os usuários
router.get('/', authenticateToken, authorizePermissions(['VIEW_USERS']), userController.getAllUsers);

// Rota para registar users
router.post('/register', authenticateToken, authorizePermissions(['VIEW_USERS']), userController.registerUser);

// Rota para criar um novo usuário
router.post('/login', userController.loginUser);

// Rota para criar um novo usuário
router.put('/', authenticateToken, authorizePermissions(['VIEW_USERS']),  userController.updateUser);

// Rota para criar um novo usuário
router.delete('/:userId', authenticateToken, authorizePermissions(['VIEW_USERS']), userController.deleteUser);

// // Rota para criar um novo usuário
// router.post('/refresh-token', userController.refreshToken);

// // Rota para obter um usuário pelo Email
// router.get('/:id', userController.getUserByEmail);

module.exports = router;
