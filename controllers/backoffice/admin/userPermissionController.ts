import { Request, Response } from "express";
import {
  UserPermission,
  Component,
  Permission,
  ComponentPermission,
} from "../../../models";
import {
  ApiError,
  CheckPermissionBody,
  ComponentAccessItem,
} from "../../../src/types/index";

export const checkUserPermission = async (
  req: Request<{}, {}, CheckPermissionBody>,
  res: Response<Record<string, boolean> | ApiError>,
): Promise<void> => {
  const userId = req.user;
  const { componentNames } = req.body;
  try {
    const permissions = await UserPermission.findAll({ where: { userId } });
    const permissionIds = permissions.map((up) => up.permissionId);
    const permissiOfUser = await Permission.findAll({
      where: { permissionId: permissionIds },
    });

    const results: Record<string, boolean> = {};
    for (const componentName of componentNames) {
      if (permissiOfUser.some((permission) => permission.name === "Admin")) {
        results[componentName] = true;
      } else {
        const components = await Component.findAll({
          where: { name: componentName },
        });
        const componentIds = components.map(
          (component) => component.componentId,
        );
        const hasRequiredPermissions = await ComponentPermission.findAll({
          where: { permissionId: permissionIds, componentId: componentIds },
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

export const getUserComponentsPermissions = async (
  req: Request,
  res: Response<ComponentAccessItem[] | ApiError>,
): Promise<void | Response> => {
  const userId = req.user;
  try {
    const userPermissions = await UserPermission.findAll({ where: { userId } });
    const permissionIds = userPermissions.map((up) => up.permissionId);

    const isAdmin = await Permission.findOne({
      where: { permissionId: permissionIds, name: "Admin" },
    });
    if (isAdmin) {
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

    const accessibleComponents = components.flatMap((userPermission: any) =>
      userPermission.permission.componentPermissions.map(
        (cp: any) => cp.component,
      ),
    );
    res.status(200).json(accessibleComponents);
  } catch (error) {
    console.error("Error fetching accessible components:", error);
    res.status(500).json({
      error: "An error occurred while fetching accessible components",
    });
  }
};

/**
 * @swagger
 * tags:
 *   name: UserPermissions
 *   description: User permission and component access checks
 */

/**
 * @swagger
 * /userpermissions:
 *   post:
 *     summary: Check if the current user has access to given components
 *     tags: [UserPermissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [componentNames]
 *             properties:
 *               componentNames:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of component names to check
 *     responses:
 *       200:
 *         description: Map of component name to boolean access result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: boolean
 *       500:
 *         description: Error checking user permissions
 */

/**
 * @swagger
 * /userpermissions:
 *   get:
 *     summary: Get all components accessible by the current user
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
 *                   name:
 *                     type: string
 *       500:
 *         description: Error fetching accessible components
 */
