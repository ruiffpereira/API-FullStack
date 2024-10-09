const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET
const { UserPermission, Component, ComponentPermission, Permission } = require('../../models');

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("nao passou")
      return res.sendStatus(403); // Forbidden
    }
    
    req.user = user.userId;

    next();
  });
};

const authorizePermissions = (requiredPermissions) => {
  return async (req, res, next) => {
    const userId = req.user; // Supondo que o ID do usuário autenticado está em req.user

    try {
      // Buscar permissões do usuário
      const permissions = await UserPermission.findAll({ where: { userId } });

      const permissionId = permissions.map(up => up.permissionId);

      const permissionName = await Permission.findAll({ where: { permissionId } });

      if (permissionName[0].name === 'Admin') {
        return next();
      }

      const components = await Component.findAll({ where: { name : requiredPermissions } });
      const componentId = components.map(component => component.componentId);
      
      // Verificar se o usuário tem todas as permissões necessárias
      const hasRequiredPermissions = await ComponentPermission.findAll({ where: { permissionId, componentId } });

      if (hasRequiredPermissions.length == 0) {
        // Nenhuma permissão encontrada
        return res.status(403).json({ error: 'User does not have the required permissions' });
      }

      next();
      
    } catch (error) {
      console.error('Error checking permissions:', error);
      res.status(500).json({ error: 'An error occurred while checking permissions' });
    }
  };
};

module.exports = {authenticateToken, authorizePermissions};