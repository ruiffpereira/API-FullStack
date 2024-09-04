const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rota para listar todos os usuários
router.post('/', userController.registerUser);

// Rota para criar um novo usuário
router.post('/login', userController.loginUser);

// // Rota para obter um usuário pelo Email
// router.get('/:id', userController.getUserByEmail);

module.exports = router;
