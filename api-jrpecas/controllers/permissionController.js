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

// Atualiza uma permissão pelo ID
const updatePermissionById = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body; // Supondo que a permissão tenha esses campos

  try {
    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }

    // Atualiza os campos da permissão
    permission.name = name || permission.name;
    permission.description = description || permission.description;

    // Salva as alterações no banco de dados
    await permission.save();

    res.json(permission);
  } catch (error) {
    console.error('Error updating permission:', error);
    res.status(500).json({ error: 'An error occurred while updating permission' });
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

// Retorna uma permissão pelo ID
const deletePermissionById = async (req, res) => {
  try {
    //console.log(req.params.id);
    const deleted = await Permission.destroy({
      where: { permissionId: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Order not found' });
    }

  } catch (error) {
    console.error('Error fetching permission:', error);
    res.status(500).json({ error: 'An error occurred while fetching permission' });
  }
};

module.exports = {
  getAllPermissions,
  createPermission,
  getPermissionById,
  deletePermissionById,
  updatePermissionById
};
