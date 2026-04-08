import { Request, Response } from "express";
import { Category, Subcategory } from "../../../models";

interface CategoryBody {
  name: string;
}

interface IdParams {
  id: string;
}

export const getAllCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
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

export const getCategoryById = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void> => {
  const userId = req.user;
  try {
    const category = await Category.findOne({
      where: { categoryId: req.params.id, userId },
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

export const upsertCategory = async (
  req: Request<IdParams, {}, CategoryBody>,
  res: Response,
): Promise<void> => {
  const userId = req.user;
  try {
    const data: Record<string, unknown> = { name: req.body.name, userId };
    if (req.params.id) data.categoryId = req.params.id;
    const [category] = await Category.upsert(data as any, { returning: true });
    res.status(200).json(category);
  } catch (error) {
    console.error("Error upserting category:", error);
    res
      .status(500)
      .json({ error: "An error occurred while upserting the category" });
  }
};

export const deleteCategory = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void> => {
  const userId = req.user;
  try {
    const deleted = await Category.destroy({
      where: { categoryId: req.params.id, userId },
      force: true,
    });
    if (deleted) {
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

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Management of product categories
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: List of categories with subcategories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 count:
 *                   type: integer
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
 *         description: Error fetching category
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
 *         required: false
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: Category created or updated successfully
 *       500:
 *         description: Error upserting category
 */

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *       500:
 *         description: Error deleting category
 */
