const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET
const { UserPermission, Component, ComponentPermission, Permission, User } = require('../../models');

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

const authenticateTokenCustomers = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  const customerId = req.params.customerId; // Supondo que o customerId seja passado como um parâmetro de rota

  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  try {
    // Buscar o userId usando o customerId
    const customer = await Customer.findOne({ where: { id: customerId } });
    if (!customer) {
      return res.sendStatus(404); // Not Found
    }

    const userId = customer.userId;

    // Buscar a secretKey usando o userId
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.sendStatus(404); // Not Found
    }

    const secretKey = user.secretKey; // Supondo que a chave secreta esteja armazenada no campo secretKey do usuário

    // Validar o token usando a secretKey
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        console.log("Token inválido");
        return res.sendStatus(403); // Forbidden
      }

      req.user = user.userId;
      next();
    });
  } catch (error) {
    console.error("Erro ao autenticar o token:", error);
    return res.sendStatus(500); // Internal Server Error
  }
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

module.exports = {authenticateToken, authorizePermissions, authenticateTokenCustomers};