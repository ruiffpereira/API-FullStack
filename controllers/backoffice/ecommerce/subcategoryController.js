const { Subcategory } = require("../../../models");

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
      attributes: ["subcategoryId", "name"],
    });
    res.status(200).json(subcategories);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching subcategories" });
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
      res.status(404).json({ error: "Subcategory not found" });
    }
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the subcategory" });
  }
};

/**
 * @swagger
 * /subcategories/{id}:
 *   put:
 *     summary: Create or update a subcategory
 *     tags: [Subcategories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the subcategory to update (if omitted, a new subcategory will be created)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the subcategory
 *               categoryId:
 *                 type: string
 *                 description: ID of the associated category
 *     responses:
 *       200:
 *         description: Subcategory updated or created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subcategory'
 *       500:
 *         description: Error updating or creating subcategory
 */

const upsertSubcategory = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      categoryId: req.body.categoryId,
    };
    // Só adiciona o id se vier nos params (update)
    if (req.params.id) {
      data.subcategoryId = req.params.id;
    }
    const [subcategory] = await Subcategory.upsert(data, { returning: true });
    res.status(200).json(subcategory);
  } catch (error) {
    console.error("Error upserting subcategory:", error);
    res
      .status(500)
      .json({ error: "An error occurred while upserting the subcategory" });
  }
};

/**
 * @swagger
 * /subcategories/{id}:
 *   delete:
 *     summary: Delete a subcategory
 *     tags: [Subcategories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the subcategory to delete
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
      where: { subcategoryId: req.params.id },
      force: true,
    });
    if (deleted > 0) {
      res.json({ message: "Subcategory deleted successfully" });
    } else {
      res.status(404).json({ error: "Subcategory not found" });
    }
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the subcategory" });
  }
};

module.exports = {
  getAllSubcategories,
  getSubcategoryById,
  upsertSubcategory,
  deleteSubcategory,
};
