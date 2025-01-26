const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET
const { UserPermission, Component, ComponentPermission, Permission, User, Customer } = require('../../models');
const { promisify } = require('util'); // Importar promisify do módulo util

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
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    console.log("Nao Autorizado Customer1")
    return res.sendStatus(401); // Unauthorized
  }

  try {
    // Promisify jwt.verify para usar async/await
    const verifyAsync = promisify(jwt.verify);

    // Buscar todos os usuários
    const users = await User.findAll();

    let decoded;
    let validUser;

     // Iterar sobre os usuários e verificar o token com cada secretKey
     for (const user of users) {
      try {
        decoded = await verifyAsync(token, user.secretkeysite);

        // Verificar se o userId no token é igual ao userId do usuário na iteração
        if (decoded.userId !== user.userId) {
          continue; // Se não for igual, continuar com o próximo usuário
        }

        validUser = user;
        break; // Se o token for verificado com sucesso, sair do loop
      } catch (err) {
        // Se a verificação falhar, continuar com o próximo usuário
        continue;
      }
    }

    if (!validUser) {
      console.log("Nao Autorizado Customer2")
      return res.sendStatus(403); // Forbidden
    }

    // Armazenar informações decodificadas no objeto de requisição
    req.data = {
      userId: validUser.userId,
      customerId: decoded.customerId,
      // Adicione outras informações do usuário, se necessário
    };
    
    console.log("Autorizado Customer")
    next();

  } catch (error) {
    console.error("Erro ao autenticar o token:", error);
    return res.sendStatus(500); // Internal Server Error
  }
};

const authorizePermissions = (requiredPermissions) => {
  console.log("Entrou no authorizePermissions")
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

module.exports = {authenticateToken, authorizePermissions, authenticateTokenCustomers};