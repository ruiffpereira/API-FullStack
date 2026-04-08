import { Request, Response } from "express";
import { Component, ComponentPermission, Permission } from "../../../models";

interface CreateComponentBody {
  name: string;
  description?: string;
  selectPermissions?: string[];
}

interface UpdateComponentBody {
  name: string;
  selectPermissions: string[];
}

interface IdParams {
  id: string;
}

export const createComponent = async (
  req: Request<{}, {}, CreateComponentBody>,
  res: Response,
): Promise<void | Response> => {
  const { name, description, selectPermissions } = req.body;
  try {
    const existingComponent = await Component.findOne({ where: { name } });
    if (existingComponent)
      return res
        .status(400)
        .json({ error: "Component with this name already exists" });
    const component = await Component.create({ name, description });
    if (selectPermissions && selectPermissions.length > 0) {
      const componentPermissions = selectPermissions.map(
        (permissionId: string) => ({
          componentId: component.componentId,
          permissionId,
        }),
      );
      await ComponentPermission.bulkCreate(componentPermissions);
    }
    res.status(201).json(component);
  } catch (error) {
    console.error("Error creating component:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the component" });
  }
};

export const getAllComponents = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const components = await Component.findAll({
      include: [{ model: Permission, as: "permissions" }],
    });
    res.json(components);
  } catch (error) {
    console.error("Error fetching components:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching components" });
  }
};

export const getComponentById = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  try {
    const component = await Component.findOne({ where: { componentId: id } });
    if (component) {
      res.json(component);
    } else {
      res.status(404).json({ error: "Component not found" });
    }
  } catch (error) {
    console.error("Error fetching component:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the component" });
  }
};

export const updateComponent = async (
  req: Request<IdParams, {}, UpdateComponentBody>,
  res: Response,
): Promise<void | Response> => {
  const { id } = req.params;
  const { name, selectPermissions } = req.body;
  try {
    const component = await Component.findOne({ where: { componentId: id } });
    if (!component)
      return res.status(404).json({ error: "Component not found" });
    component.name = name;
    await component.save();

    const currentPermissions = await ComponentPermission.findAll({
      where: { componentId: id },
    });
    const currentPermissionIds = currentPermissions.map(
      (cp) => cp.permissionId,
    );

    const permissionsToAdd = selectPermissions.filter(
      (pid: string) => !currentPermissionIds.includes(pid),
    );
    const permissionsToRemove = currentPermissionIds.filter(
      (pid) => !selectPermissions.includes(pid),
    );

    if (permissionsToAdd.length > 0) {
      await ComponentPermission.bulkCreate(
        permissionsToAdd.map((permissionId: string) => ({
          componentId: id,
          permissionId,
        })),
      );
    }
    if (permissionsToRemove.length > 0) {
      await ComponentPermission.destroy({
        where: { componentId: id, permissionId: permissionsToRemove },
      });
    }
    res
      .status(200)
      .json({ message: "Component and permissions updated successfully" });
  } catch (error) {
    console.error("Error updating component:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the component" });
  }
};

export const deleteComponent = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void | Response> => {
  const { id } = req.params;
  try {
    const component = await Component.findOne({ where: { componentId: id } });
    if (!component)
      return res.status(404).json({ error: "Component not found" });
    await ComponentPermission.destroy({ where: { componentId: id } });
    await component.destroy();
    res.status(200).json({
      message: "Component and associated permissions deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting component:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the component" });
  }
};

/**
 * @swagger
 * tags:
 *   name: Components
 *   description: Management of UI components and their permissions
 */

/**
 * @swagger
 * /components:
 *   post:
 *     summary: Create a new component
 *     tags: [Components]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               selectPermissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Component created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Component'
 *       400:
 *         description: Component with this name already exists
 *       500:
 *         description: Error creating component
 */

/**
 * @swagger
 * /components:
 *   get:
 *     summary: Get all components
 *     tags: [Components]
 *     responses:
 *       200:
 *         description: List of components
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Component'
 *       500:
 *         description: Error fetching components
 */

/**
 * @swagger
 * /components/{id}:
 *   get:
 *     summary: Get a component by ID
 *     tags: [Components]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Component details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Component'
 *       404:
 *         description: Component not found
 *       500:
 *         description: Error fetching component
 */

/**
 * @swagger
 * /components/{id}:
 *   put:
 *     summary: Update a component by ID
 *     tags: [Components]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               selectPermissions:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Component and permissions updated successfully
 *       404:
 *         description: Component not found
 *       500:
 *         description: Error updating component
 */

/**
 * @swagger
 * /components/{id}:
 *   delete:
 *     summary: Delete a component by ID
 *     tags: [Components]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Component and associated permissions deleted successfully
 *       404:
 *         description: Component not found
 *       500:
 *         description: Error deleting component
 */
