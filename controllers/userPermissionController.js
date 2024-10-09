const { UserPermission, Component, Permission, ComponentPermission } = require('../models');

// Associa uma permissão a um usuário
const checkUserPermission = async (req, res) => {
  const userId = req.user;
  const { componentName } = req.body;

  try {

      // Buscar permissões do usuário
      const permissions = await UserPermission.findAll({ where: { userId } });

      const permissionId = permissions.map(up => up.permissionId);

      const permissionName = await Permission.findAll({ where: { permissionId } });

      if (permissionName[0].name === 'Admin') {
        console.log('aqui')
        return res.status(200).json({ hasAcess: true });
      }

      console.log('aqui1')
      const components = await Component.findAll({ where: { name : componentName } });
      const componentId = components.map(component => component.componentId);
      
      // Verificar se o usuário tem todas as permissões necessárias
      const hasRequiredPermissions = await ComponentPermission.findAll({ where: { permissionId, componentId } });
      console.log('aqui2')
      if (hasRequiredPermissions.length == 0) {
        // Nenhuma permissão encontrada
        return res.status(403).json({ error: 'User does not have the required permissions' });
      }
       console.log('aqui3')
      res.status(200).json({ hasAcess: true });

  } catch (error) {
    console.error('Error assigning permission to user:', error);
    res.status(500).json({ error: 'An error occurred while assigning permission to user' });
  }
};

module.exports = {
  checkUserPermission,
};
