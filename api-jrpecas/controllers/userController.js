const { User } = require('../models');

// Retorna todos os usuários
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findOne({ where: { email } });
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
};

// Retorna todos os usuários
const getUserByEmail = async (req, res) => {
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

module.exports = {
  getAllUsers,
  createUser,
  getUserByEmail,
};
