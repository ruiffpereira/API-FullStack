// controllers/componentController.js
const { Component } = require('../../../models');
const { ComponentPermission } = require('../../../models');
const { Permission } = require('../../../models');

// Cria um novo componente
const createComponent = async (req, res) => {
  const { name, description, selectPermissions } = req.body;
  try {
     // Verifica se o nome já existe
     const existingComponent = await Component.findOne({ where: { name } });
     if (existingComponent) {
       return res.status(400).json({ error: 'Component with this name already exists' });
     }

    const component = await Component.create({ name, description });

    // Verifica se há permissões para associar
    if (selectPermissions && selectPermissions.length > 0) {
      const componentPermissions = selectPermissions.map(permissionId => ({
        componentId: component.componentId,
        permissionId,
      }));

      // Insere as associações na tabela ComponentPermission
      await ComponentPermission.bulkCreate(componentPermissions);
    }

    res.status(201).json(component);
  } catch (error) {
    console.error('Error creating component:', error);
    res.status(500).json({ error: 'An error occurred while creating the component' });
  }
};

// Obtém todos os componentes
const getAllComponents = async (req, res) => {
  try {
    const components = await Component.findAll({
      include: [
        {
          model: Permission,
          as: 'permissions',
        },
      ],
    });
    res.json(components);
  } catch (error) {
    console.error('Error fetching components:', error);
    res.status(500).json({ error: 'An error occurred while fetching components' });
  }
};

// Obtém um componente pelo ID
const getComponentById = async (req, res) => {
  const { id } = req.params;
  try {
    const component = await Component.findOne();
    if (component) {
      res.json(component);
    } else {
      res.status(404).json({ error: 'Component not found' });
    }
  } catch (error) {
    console.error('Error fetching component:', error);
    res.status(500).json({ error: 'An error occurred while fetching the component' });
  }
};

// Atualiza um componente pelo ID
const updateComponent = async (req, res) => {
  const { id } = req.params;
  const { name, selectPermissions } = req.body;
  try {
    const component = await Component.findOne({ where: { componentId : id } });

    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }

    // Atualizar o nome do componente
    component.name = name;
    await component.save();

    // Buscar permissões atuais associadas ao componente
    const currentPermissions = await ComponentPermission.findAll({ where: { componentId: id } });
    const currentPermissionIds = currentPermissions.map(cp => cp.permissionId);

    // Determinar permissões a adicionar e remover
    const permissionsToAdd = selectPermissions.filter(permissionId => !currentPermissionIds.includes(permissionId));
    const permissionsToRemove = currentPermissionIds.filter(permissionId => !selectPermissions.includes(permissionId));

    // Adicionar novas permissões
    if (permissionsToAdd.length > 0) {
      const newComponentPermissions = permissionsToAdd.map(permissionId => ({
        componentId: id,
        permissionId,
      }));
      await ComponentPermission.bulkCreate(newComponentPermissions);
    }

    // Remover permissões que não estão mais no array recebido
    if (permissionsToRemove.length > 0) {
      await ComponentPermission.destroy({
        where: {
          componentId: id,
          permissionId: permissionsToRemove,
        },
      });
    }

    res.status(200).json({ message: 'Component and permissions updated successfully' });
  } catch (error) {
    console.error('Error updating component:', error);
    res.status(500).json({ error: 'An error occurred while updating the component' });
  }
};

// Exclui um componente pelo ID
const deleteComponent = async (req, res) => {
  const { id } = req.params;
  try {
    // Buscar o componente pelo ID
    const component = await Component.findOne({ where: { componentId: id } });

    if (!component) {
      return res.status(404).json({ error: 'Component not found' });
    }

    // Deletar todas as associações na tabela ComponentPermission
    await ComponentPermission.destroy({
      where: { componentId : id }
    });

    // Deletar o componente
    await component.destroy();

    res.status(200).json({ message: 'Component and associated permissions deleted successfully' });
  } catch (error) {
    console.error('Error deleting component:', error);
    res.status(500).json({ error: 'An error occurred while deleting the component' });
  }
};

module.exports = {
  createComponent,
  getAllComponents,
  getComponentById,
  updateComponent,
  deleteComponent,
};

/**
 * @swagger
 * tags:
 *   name: Components
 *   description: Management of components and their permissions
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
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the component
 *               description:
 *                 type: string
 *                 description: Description of the component
 *               selectPermissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of permission IDs to associate with the component
 *     responses:
 *       201:
 *         description: Component created successfully
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
 *         description: ID of the component
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
 *         description: Error fetching the component
 */

/**
 * @swagger
 * /components/{id}:
 *   put:
 *     summary: Update a component
 *     tags: [Components]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the component to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the component
 *               selectPermissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of permission IDs to associate with the component
 *     responses:
 *       200:
 *         description: Component and permissions updated successfully
 *       404:
 *         description: Component not found
 *       500:
 *         description: Error updating the component
 */

/**
 * @swagger
 * /components/{id}:
 *   delete:
 *     summary: Delete a component
 *     tags: [Components]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the component to delete
 *     responses:
 *       200:
 *         description: Component and associated permissions deleted successfully
 *       404:
 *         description: Component not found
 *       500:
 *         description: Error deleting the component
 */