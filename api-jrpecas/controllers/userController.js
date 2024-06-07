const { User } = require('../models');

// Retorna todos os usuários
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);s
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
};

// Cria um novo usuário
const createUser = async (req, res) => {
  const { username, password, email } = req.body;
  try {
    const newUser = await User.create({ username, password, email });
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'An error occurred while creating user' });
  }
};

// Retorna um usuário pelo ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'An error occurred while fetching user' });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
};
