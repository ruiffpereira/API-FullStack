const { Permission, UserPermission } = require('../models');

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
    const permissionId = req.params.id;
    console.log(req.params);
    // Verifica se a permissão está associada a algum usuário
    const userPermissionsCount = await UserPermission.count({
      where: { permissionId }
    });
    console.log(userPermissionsCount);
    if (userPermissionsCount > 0) {
      return res.status(400).json({ error: 'Cannot delete permission because it is associated with one or more users.' });
    }

    // Tenta destruir a permissão
    const deleted = await Permission.destroy({
      where: { permissionId }
    });

    if (deleted) {
      res.status(204).json({ data: 'Permission deleted with sucess' });
    } else {
      res.status(404).json({ error: 'Permission not found' });
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
