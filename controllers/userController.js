
const { User, Permission, UserPermission, sequelize } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET
require('dotenv').config(); 
const environment = process.env.ENVIROMENT || 'DEV';

// Retorna todas as permissões
const getAllUsers = async (req, res) => {
  console.log("teste")
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }, // Exclui o campo 'password'
      include: [
        {
          model: Permission,
          as: 'permissions',
          attributes: ['permissionId', 'name'],
          through: { attributes: [] },
        },
      ],
    });
    console.log(users)
    res.json(users);
  } catch (error) {
    console.error('Error fetching Users:', error);
    res.status(500).json({ error: 'An error occurred while fetching Users' });
  }
};

const registerUser = async (req, res) => {
  try {
    const { name, email, permissionId, password, secretkeysite} = req.body;
    
    if (!email || !password || !name | !secretkeysite || !permissionId) {
        return res.status(400).json({ error: 'Invalid Fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

     // Iniciar uma transação para garantir atomicidade
     const transaction = await sequelize.transaction();

    try {
        // Criar o usuário
      const user = await User.create({ email, password: hashedPassword, name, secretkeysite }, { transaction });

      // Atribuir a permissão ao usuário
      await UserPermission.create({ userId: user.dataValues.userId, permissionId }, { transaction });

      // Confirmar a transação
      await transaction.commit();

        return res.status(201).json({ user: user });
    
      } catch (error) {
        await transaction.rollback();
        // Logar o erro para depuração
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'User creation failed' });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
};

const loginUser = async (req, res) => {
  console.log("teste")
  const { name, password } = req.body;
  
  try {
    const user = await User.findOne({ 
      where: { name }
     });

    if (!user) {
      return res.status(404).json({ error: 'Incorrect Data!' });
    }

    if (environment !== "DEV") {
        // Verificar se a senha e o hash estão presentes
      if (!password || !user.password) {
        return res.status(400).json({ error: 'Password and hash are required' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
    }
    
    // Gerar token JWT
    const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('token-bo', token, { httpOnly: true });
    console.log("Login com sucesso")

    return res.json({ userId: user.userId, username: user.username, email: user.email, token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error test' });
  }
};

const updateUser = async (req, res) => {

  const { userId, name, email, password, permissionId, secretkeysite } = req.body;

  console.log(req.body)

  try {
    // Iniciar uma transação para garantir atomicidade
    const transaction = await sequelize.transaction();

    try {
      // Encontrar o usuário pelo ID
      const user = await User.findByPk(userId, { transaction });

      if (!user) {
        await transaction.rollback();
        return res.status(404).json({ error: 'User not found' });
      }

      // Atualizar os dados do usuário
      if (name) user.name = name;
      if (email) user.email = email;
      if (secretkeysite) user.secretkeysite = secretkeysite;
      if (password) user.password = await bcrypt.hash(password, 10);

      // Salvar as alterações no usuário
      await user.save({ transaction });

      // Atualizar as permissões do usuário
      if (permissionId) {
        // Atualizar o campo permissionId na tabela UserPermission
        await UserPermission.update(
          { permissionId },
          { where: { userId }, transaction }
        );
      }

      // Confirmar a transação
      await transaction.commit();

      return res.json({ message: 'User updated successfully', user });
    } catch (error) {
      // Reverter a transação em caso de erro
      await transaction.rollback();
      console.error('Error updating user or permissions:', error);
      return res.status(500).json({ error: 'User update failed' });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'An error occurred while updating the user' });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;
  console.log("aqui: ",userId)

  try {
    // Iniciar uma transação para garantir atomicidade
    const transaction = await sequelize.transaction();

    try {
      // Encontrar o usuário pelo ID
      const user = await User.findByPk(userId, { transaction });
      console.log("aqui1: ",user)

      if (!user) {
        await transaction.rollback();
        return res.status(404).json({ error: 'User not found' });
      }

      // Deletar as permissões do usuário
      await UserPermission.destroy({ where: { userId }, transaction });
    console.log("aqui2")
      // Deletar o usuário
      await User.destroy({ where: { userId }, transaction });
      console.log("aqui3")
      // Confirmar a transação
      await transaction.commit();

      return res.json({ message: 'User deleted successfully' });
    } catch (error) {
      // Reverter a transação em caso de erro
      await transaction.rollback();
      console.error('Error deleting user or permissions:', error);
      return res.status(500).json({ error: 'User deletion failed' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'An error occurred while deleting the user' });
  }
};

module.exports = {getAllUsers, registerUser, loginUser, updateUser, deleteUser};
