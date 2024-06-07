const { Permission } = require('../models');

// Retorna todas as permissões
const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.json(permissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ error: 'An error occurred while fetching permissions' });
  }
};

// Cria uma nova permissão
const createPermission = async (req, res) => {
  const { name, description } = req.body;
  try {
    const newPermission = await Permission.create({ name, description });
    res.status(201).json(newPermission);
  } catch (error) {
    console.error('Error creating permission:', error);
    res.status(500).json({ error: 'An error occurred while creating permission' });
  }
};

// Retorna uma permissão pelo ID
const getPermissionById = async (req, res) => {
  const { id } = req.params;
  try {
    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }
    res.json(permission);
  } catch (error) {
    console.error('Error fetching permission:', error);
    res.status(500).json({ error: 'An error occurred while fetching permission' });
  }
};

module.exports = {
  getAllPermissions,
  createPermission,
  getPermissionById,
};
