const { Permission, UserPermission } = require('../../../models');

// Retorna todas as permissões
const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.json(permissions);
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ error: 'An error occurred while fetching permissions' });
  }
};

// Cria uma nova permissão
const createPermission = async (req, res) => {
  const { name, description } = req.body;
  try {
    // Verifica se o nome já existe
    const existingPermission = await Permission.findOne({ where: { name } });
    if (existingPermission) {
      return res.status(400).json({ error: 'Permission with this name already exists' });
    }
    const newPermission = await Permission.create({ name, description });
    res.status(201).json(newPermission);
  } catch (error) {
    console.error('Error creating permission:', error);
    res.status(500).json({ error: 'An error occurred while creating permission' });
  }
};

// Atualiza uma permissão pelo ID
const updatePermissionById = async (req, res) => {
  const permissionId = req.params.id;
  const { name, description } = req.body; // Supondo que a permissão tenha esses campos

  // Verifica se a permissão é "Admin"
  const permission = await Permission.findOne({
    where: { permissionId }
  });

  if (permission && permission.name === 'Admin') {
    return res.status(400).json({ error: 'Cannot edit permission!' });
  }

  try {
    const permission = await Permission.findByPk(permissionId);
    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }

    // Atualiza os campos da permissão
    permission.name = name || permission.name;
    permission.description = description || permission.description;

    // Salva as alterações no banco de dados
    await permission.save();

    res.json(permission);
  } catch (error) {
    console.error('Error updating permission:', error);
    res.status(500).json({ error: 'An error occurred while updating permission' });
  }
};

// Retorna uma permissão pelo ID
const getPermissionById = async (req, res) => {
  const { id } = req.params;
  try {
    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({ error: 'Permission not found' });
    }
    res.json(permission);
  } catch (error) {
    console.error('Error fetching permission:', error);
    res.status(500).json({ error: 'An error occurred while fetching permission' });
  }
};

// Retorna uma permissão pelo ID
const deletePermissionById = async (req, res) => {
  try {
    const permissionId = req.params.id;
    console.log(req.params);

    // Verifica se a permissão é "Admin"
    const permission = await Permission.findOne({
      where: { permissionId }
    });

    if (permission && permission.name === 'Admin') {
      return res.status(400).json({ error: 'Cannot delete permission!' });
    }

    // Verifica se a permissão está associada a algum usuário
    const userPermissionsCount = await UserPermission.count({
      where: { permissionId }
    });
    console.log(userPermissionsCount);
    if (userPermissionsCount > 0) {
      return res.status(400).json({ error: 'Cannot delete permission because it is associated with one or more users.' });
    }

    // Tenta destruir a permissão
    const deleted = await Permission.destroy({
      where: { permissionId }
    });

    if (deleted) {
      res.status(204).json({ data: 'Permission deleted with sucess' });
    } else {
      res.status(404).json({ error: 'Permission not found' });
    }

  } catch (error) {
    console.error('Error fetching permission:', error);
    res.status(500).json({ error: 'An error occurred while fetching permission' });
  }
};

module.exports = {
  getAllPermissions,
  createPermission,
  getPermissionById,
  deletePermissionById,
  updatePermissionById
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
 *                 description: Name of the permission
 *               description:
 *                 type: string
 *                 description: Description of the permission
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
 *         description: ID of the permission
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
 *         description: ID of the permission to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the permission
 *               description:
 *                 type: string
 *                 description: Updated description of the permission
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *       400:
 *         description: Cannot edit permission (e.g., Admin permission)
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
 *         description: ID of the permission to delete
 *     responses:
 *       204:
 *         description: Permission deleted successfully
 *       400:
 *         description: Cannot delete permission (e.g., Admin permission or associated with users)
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Error deleting permission
 */