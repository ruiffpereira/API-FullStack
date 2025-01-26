const { UserPermission, Component, Permission, ComponentPermission } = require('../models');

// Associa uma permissão a um usuário
const checkUserPermission = async (req, res) => {
  const userId = req.user;
  const { componentNames } = req.body; // Aceitar múltiplos nomes de componentes

  try {
    // Buscar permissões do usuário
    const permissions = await UserPermission.findAll({ where: { userId } });
    const permissionIds = permissions.map(up => up.permissionId);

    const permissiOfUser = await Permission.findAll({ where: { permissionId: permissionIds } });

    // Verificar permissões para cada componente
    const results = {};
    for (const componentName of componentNames) {
      // Verificar se o usuário é Admin
      if (permissiOfUser.some(permission => permission.name === 'Admin')) {
        results[componentName] = true;
      } else {
        // Buscar componentes e permissões
        const components = await Component.findAll({ where: { name: componentName } });

        const componentIds = components.map(component => component.componentId);

        const hasRequiredPermissions = await ComponentPermission.findAll({
          where: {
            permissionId: permissionIds,
            componentId: componentIds
          }
        });

        results[componentName] = hasRequiredPermissions.length > 0;
      }
    }
    
    res.status(200).json(results);

  } catch (error) {
    console.error('Error checking user permissions:', error);
    res.status(500).json({ error: 'An error occurred while checking user permissions' });
  }
};

module.exports = {
  checkUserPermission,
};
