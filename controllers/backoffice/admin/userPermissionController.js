const {
  UserPermission,
  Component,
  Permission,
  ComponentPermission,
} = require("../../../models");

// Associa uma permissão a um usuário
const checkUserPermission = async (req, res) => {
  const userId = req.user;
  const { componentNames } = req.body; // Aceitar múltiplos nomes de componentes

  try {
    // Buscar permissões do usuário
    const permissions = await UserPermission.findAll({ where: { userId } });
    const permissionIds = permissions.map((up) => up.permissionId);

    const permissiOfUser = await Permission.findAll({
      where: { permissionId: permissionIds },
    });

    // Verificar permissões para cada componente
    const results = {};
    for (const componentName of componentNames) {
      // Verificar se o usuário é Admin
      if (permissiOfUser.some((permission) => permission.name === "Admin")) {
        results[componentName] = true;
      } else {
        // Buscar componentes e permissões
        const components = await Component.findAll({
          where: { name: componentName },
        });

        const componentIds = components.map(
          (component) => component.componentId
        );

        const hasRequiredPermissions = await ComponentPermission.findAll({
          where: {
            permissionId: permissionIds,
            componentId: componentIds,
          },
        });

        results[componentName] = hasRequiredPermissions.length > 0;
      }
    }

    res.status(200).json(results);
  } catch (error) {
    console.error("Error checking user permissions:", error);
    res
      .status(500)
      .json({ error: "An error occurred while checking user permissions" });
  }
};

const getUserComponentsPermissions = async (req, res) => {
  const userId = req.user;
  try {
    // Buscar permissões do usuário
    const userPermissions = await UserPermission.findAll({ where: { userId } });
    const permissionIds = userPermissions.map((up) => up.permissionId);

    // Verificar se o usuário é Admin
    const isAdmin = await Permission.findOne({
      where: { permissionId: permissionIds, name: "Admin" },
    });

    if (isAdmin) {
      // Se o usuário for Admin, retorna todos os componentes
      const allComponents = await Component.findAll({
        attributes: ["componentId", "name"],
      });
      return res.status(200).json(allComponents);
    }

    const components = await UserPermission.findAll({
      where: { userId },
      include: [
        {
          model: Permission,
          as: "permission",
          include: [
            {
              model: ComponentPermission,
              as: "componentPermissions",
              include: [
                {
                  model: Component,
                  as: "component",
                  attributes: ["componentId", "name"],
                },
              ],
            },
          ],
        },
      ],
    });

    // Extrair apenas os componentes
    const accessibleComponents = components.flatMap((userPermission) =>
      userPermission.permission.componentPermissions.map(
        (componentPermission) => componentPermission.component
      )
    );

    res.status(200).json(accessibleComponents);
  } catch (error) {
    console.error("Error fetching accessible components:", error);
    res.status(500).json({
      error: "An error occurred while fetching accessible components",
    });
  }
};

module.exports = {
  checkUserPermission,
  getUserComponentsPermissions,
};

/**
 * @swagger
 * tags:
 *   name: UserPermissions
 *   description: Management of user permissions
 */

/**
 * @swagger
 * /userpermissions:
 *   post:
 *     summary: Check user permissions for components
 *     tags: [UserPermissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               componentNames:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of component names to check permissions for
 *     responses:
 *       200:
 *         description: Permissions for the specified components
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: boolean
 *                 description: Whether the user has permission for the component
 *       500:
 *         description: Error checking user permissions
 */

/**
 * @swagger
 * /userpermissions:
 *   get:
 *     summary: Get components accessible to the user
 *     tags: [UserPermissions]
 *     responses:
 *       200:
 *         description: List of accessible components
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   componentId:
 *                     type: string
 *                     description: ID of the component
 *                   name:
 *                     type: string
 *                     description: Name of the component
 *       500:
 *         description: Error fetching accessible components
 */
