import { Request, Response } from "express";
import { Permission, UserPermission } from "../../../models";
import {
  ApiError,
  IdParams,
  PermissionBody,
  PermissionResponse,
} from "../../../src/types/index";

export const getAllPermissions = async (
  req: Request,
  res: Response<PermissionResponse[] | ApiError>,
): Promise<void> => {
  try {
    const permissions = await Permission.findAll();
    res.json(permissions);
  } catch (error) {
    console.error("Error fetching permissions:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching permissions" });
  }
};

export const createPermission = async (
  req: Request<{}, {}, PermissionBody>,
  res: Response<PermissionResponse | ApiError>,
): Promise<void | Response> => {
  const { name, description } = req.body;
  try {
    const existingPermission = await Permission.findOne({ where: { name } });
    if (existingPermission)
      return res
        .status(400)
        .json({ error: "Permission with this name already exists" });
    const newPermission = await Permission.create({ name, description });
    res.status(201).json(newPermission);
  } catch (error) {
    console.error("Error creating permission:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating permission" });
  }
};

export const updatePermissionById = async (
  req: Request<IdParams, {}, Partial<PermissionBody>>,
  res: Response<PermissionResponse | ApiError>,
): Promise<void | Response> => {
  const permissionId = req.params.id;
  const { name, description } = req.body;
  const check = await Permission.findOne({ where: { permissionId } });
  if (check && check.name === "Admin")
    return res.status(400).json({ error: "Cannot edit permission!" });
  try {
    const permission = await Permission.findByPk(permissionId);
    if (!permission)
      return res.status(404).json({ error: "Permission not found" });
    permission.name = name || permission.name;
    permission.description = description || permission.description;
    await permission.save();
    res.json(permission);
  } catch (error) {
    console.error("Error updating permission:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating permission" });
  }
};

export const getPermissionById = async (
  req: Request<IdParams>,
  res: Response<PermissionResponse | ApiError>,
): Promise<void | Response> => {
  const { id } = req.params;
  try {
    const permission = await Permission.findByPk(id);
    if (!permission)
      return res.status(404).json({ error: "Permission not found" });
    res.json(permission);
  } catch (error) {
    console.error("Error fetching permission:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching permission" });
  }
};

export const deletePermissionById = async (
  req: Request<IdParams>,
  res: Response<{ data: string } | ApiError>,
): Promise<void | Response> => {
  try {
    const permissionId = req.params.id;
    const permission = await Permission.findOne({ where: { permissionId } });
    if (permission && permission.name === "Admin")
      return res.status(400).json({ error: "Cannot delete permission!" });
    const userPermissionsCount = await UserPermission.count({
      where: { permissionId },
    });
    if (userPermissionsCount > 0) {
      return res.status(400).json({
        error:
          "Cannot delete permission because it is associated with one or more users.",
      });
    }
    const deleted = await Permission.destroy({ where: { permissionId } });
    if (deleted) {
      res.status(204).json({ data: "Permission deleted with sucess" });
    } else {
      res.status(404).json({ error: "Permission not found" });
    }
  } catch (error) {
    console.error("Error fetching permission:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching permission" });
  }
};

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: Management of permissions
 */

/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: List of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 *       500:
 *         description: Error fetching permissions
 */

/**
 * @swagger
 * /permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Permission created successfully
 *       400:
 *         description: Permission with this name already exists
 *       500:
 *         description: Error creating permission
 */

/**
 * @swagger
 * /permissions/{id}:
 *   get:
 *     summary: Get a permission by ID
 *     tags: [Permissions]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permission details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Error fetching permission
 */

/**
 * @swagger
 * /permissions/{id}:
 *   put:
 *     summary: Update a permission by ID
 *     tags: [Permissions]
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
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *       400:
 *         description: Cannot edit permission
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Error updating permission
 */

/**
 * @swagger
 * /permissions/{id}:
 *   delete:
 *     summary: Delete a permission by ID
 *     tags: [Permissions]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Permission deleted successfully
 *       400:
 *         description: Cannot delete permission
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Error deleting permission
 */
