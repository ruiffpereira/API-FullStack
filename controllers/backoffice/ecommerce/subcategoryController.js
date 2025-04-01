const { Subcategory } = require('../../../models');

/**
 * @swagger
 * tags:
 *   name: Subcategories
 *   description: Management of subcategories
 */

/**
 * @swagger
 * /subcategories:
 *   get:
 *     summary: Get all subcategories
 *     tags: [Subcategories]
 *     responses:
 *       200:
 *         description: List of subcategories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subcategory'
 *       500:
 *         description: Error fetching subcategories
 */
const getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.findAll({
      attributes: ['subcategoryId', 'name'], // Select only the desired attributes
    });
    res.status(200).json(subcategories);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    res.status(500).json({ error: 'An error occurred while fetching subcategories' });
  }
};

/**
 * @swagger
 * /subcategories/{id}:
 *   get:
 *     summary: Get a subcategory by ID
 *     tags: [Subcategories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the subcategory
 *     responses:
 *       200:
 *         description: Subcategory details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subcategory'
 *       404:
 *         description: Subcategory not found
 *       500:
 *         description: Error fetching subcategory
 */
const getSubcategoryById = async (req, res) => {
  try {
    const subcategory = await Subcategory.findByPk(req.params.id);
    if (subcategory) {
      res.status(200).json(subcategory);
    } else {
      res.status(404).json({ error: 'Subcategory not found' });
    }
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    res.status(500).json({ error: 'An error occurred while fetching the subcategory' });
  }
};

/**
 * @swagger
 * /subcategories:
 *   post:
 *     summary: Create a new subcategory
 *     tags: [Subcategories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newSubcategory:
 *                 type: string
 *                 description: Name of the new subcategory
 *               selectedCategory:
 *                 type: string
 *                 description: ID of the associated category
 *     responses:
 *       201:
 *         description: Subcategory created successfully
 *       500:
 *         description: Error creating subcategory
 */
const createSubcategory = async (req, res) => {
  try {
    const subcategory = await Subcategory.create({
      name: req.body.newSubcategory,
      categoryId: req.body.selectedCategory,
    });
    res.status(201).json(subcategory);
  } catch (error) {
    console.error('Error creating subcategory:', error);
    res.status(500).json({ error: 'An error occurred while creating the subcategory' });
  }
};

/**
 * @swagger
 * /subcategories/{id}:
 *   put:
 *     summary: Update a subcategory
 *     tags: [Subcategories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the subcategory to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name of the subcategory
 *               categoryId:
 *                 type: string
 *                 description: ID of the associated category
 *     responses:
 *       200:
 *         description: Subcategory updated successfully
 *       404:
 *         description: Subcategory not found
 *       500:
 *         description: Error updating subcategory
 */
const updateSubcategory = async (req, res) => {
  try {
    const updated = await Subcategory.update(
      { name: req.body.name },
      {
        where: {
          subcategoryId: req.body.subcategoryId,
          categoryId: req.body.categoryId,
        },
      }
    );
    if (updated) {
      const updatedSubcategory = await Subcategory.findByPk(req.params.id);
      res.json(updatedSubcategory);
    } else {
      res.status(404).json({ error: 'Subcategory not found' });
    }
  } catch (error) {
    console.error('Error updating subcategory:', error);
    res.status(500).json({ error: 'An error occurred while updating the subcategory' });
  }
};

/**
 * @swagger
 * /subcategories:
 *   delete:
 *     summary: Delete a subcategory
 *     tags: [Subcategories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subcategoryId:
 *                 type: string
 *                 description: ID of the subcategory to delete
 *               categoryId:
 *                 type: string
 *                 description: ID of the associated category
 *     responses:
 *       200:
 *         description: Subcategory deleted successfully
 *       404:
 *         description: Subcategory not found
 *       500:
 *         description: Error deleting subcategory
 */
const deleteSubcategory = async (req, res) => {
  try {
    const deleted = await Subcategory.destroy({
      where: {
        categoryId: req.body.categoryId,
        subcategoryId: req.body.subcategoryId,
      },
      force: true,
    });
    if (deleted > 0) {
      res.json(deleted);
    } else {
      res.status(404).json({ error: 'Subcategory not found' });
    }
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    res.status(500).json({ error: 'An error occurred while deleting the subcategory' });
  }
};

module.exports = {
  getAllSubcategories,
  getSubcategoryById,
  createSubcategory,
  updateSubcategory,
  deleteSubcategory,
};