const { Category, Subcategory } = require("../../../models");
const category = require("../../../models/category");

const getAllCategories = async (req, res) => {
  const userId = req.user;
  try {
    const categories = await Category.findAndCountAll({
      where: { userId },
      include: [{ model: Subcategory, as: "subcategories" }],
    });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching categories" });
  }
};

const getCategoryById = async (req, res) => {
  const userId = req.user;
  try {
    const category = await Category.findByPk({
      where: {
        id: req.params.id,
        userId: userId,
      },
    });
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (error) {
    console.error("Error fetching category:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the category" });
  }
};

const upsertCategory = async (req, res) => {
  const userId = req.user;
  try {
    const data = {
      name: req.body.name,
      userId,
    };
    if (req.params.id) {
      data.categoryId = req.params.id;
    }
    console.log("Upserting category with data:", data);
    const [category] = await Category.upsert(data, { returning: true });
    res.status(200).json(category);
  } catch (error) {
    console.error("Error upserting category:", error);
    res
      .status(500)
      .json({ error: "An error occurred while upserting the category" });
  }
};

const deleteCategory = async (req, res) => {
  const userId = req.user;
  try {
    const deleted = await Category.destroy({
      where: { categoryId: req.params.id, userId },
      force: true,
    });
    if (deleted) {
      //res.status(204).json();
      res.json(deleted);
    } else {
      res.status(404).json({ error: "Category not found" });
    }
  } catch (error) {
    console.error("Error deleting category:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the category" });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  upsertCategory,
  deleteCategory,
};

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Management of categories
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
 *                   description: Total number of categories
 *                 rows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Category'
 *       500:
 *         description: Error fetching categories
 */

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category
 *     responses:
 *       200:
 *         description: Category details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Category not found
 *       500:
 *         description: Error fetching the category
 */

/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Create or update a category
 *     tags: [Categories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category to update (if omitted, a new category will be created)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the category
 *     responses:
 *       200:
 *         description: Category created or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       500:
 *         description: Error upserting category
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the category to delete
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Error deleting category
 */
