const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET
const JWT_SECRET_PUBLIC = process.env.JWT_SECRET_PUBLIC
const { UserPermission, Component, ComponentPermission, Permission, User, Customer } = require('../../models');
const swaggerActivationStart = Date.now();
const swaggerActivationDuration = 20 * 60 * 1000; // 10 minutos em milissegundos

// Middleware para verificar se a rota ainda está acessível
const swaggerAccessMiddleware = (req, res, next) => {

  if (process.env.ENVIROMENT === 'DEV') {
    return next(); // Ignorar a verificação no ambiente de desenvolvimento
  }

  const currentTime = Date.now();
  if (currentTime - swaggerActivationStart > swaggerActivationDuration) {
    return res.status(403).json({ error: 'Access to Swagger documentation has expired' });
  }
  next();
};

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    console.log("Nao Autorizado BO")
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("Nao Autorizado BO1")
      return res.sendStatus(403); // Forbidden
    }
    
    console.log("Autorizado BO")
    req.user = user.userId;

    next();
  });
};

const authenticateTokenCustomers = async (req, res, next) => {

  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    console.log("Nao Autorizado BO")
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, customer) => {
    if (err) {
      console.log("Nao Autorizado BO1")
      return res.sendStatus(403); // Forbidden
    }
    
    req.customerId = customer.customerId;

    next();
  });
};

const authenticateTokenPublic = (req, res, next) => {

  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    console.log("Nao Autorizado BO")
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, JWT_SECRET_PUBLIC, (err, user) => {
    if (err) {
      console.log("Nao Autorizado BO1")
      return res.sendStatus(403); // Forbidden
    }
    
    //console.log("Autorizado BO")
    req.userId = user.userId;

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
        console.log("Autorizado Permissao")
        return next();
      }

      const components = await Component.findAll({ where: { name : requiredPermissions } });
      const componentId = components.map(component => component.componentId);
      
      // Verificar se o usuário tem todas as permissões necessárias
      const hasRequiredPermissions = await ComponentPermission.findAll({ where: { permissionId, componentId } });

      if (hasRequiredPermissions.length == 0) {
        // Nenhuma permissão encontrada
        console.log("Nao Autorizado Permissao")
        return res.status(403).json({ error: 'User does not have the required permissions' });
      }

      console.log("Autorizado Permissao")

      next();
      
    } catch (error) {
      console.error('Error checking permissions:', error);
      res.status(500).json({ error: 'An error occurred while checking permissions' });
    }
  };
};

module.exports = {authenticateToken, authorizePermissions, authenticateTokenCustomers, authenticateTokenPublic, swaggerAccessMiddleware};