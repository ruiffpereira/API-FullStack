const { UserPermission } = require('../models');

// Associa uma permissão a um usuário
const assignPermissionToUser = async (req, res) => {
  const { userId, permissionId } = req.body;
  try {
    const userPermission = await UserPermission.create({ userId, permissionId });
    res.status(201).json(userPermission);
  } catch (error) {
    console.error('Error assigning permission to user:', error);
    res.status(500).json({ error: 'An error occurred while assigning permission to user' });
  }
};

module.exports = {
  assignPermissionToUser,
};
