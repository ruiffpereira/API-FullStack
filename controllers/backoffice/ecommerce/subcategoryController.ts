import { Request, Response } from "express";
import { Subcategory } from "../../../models";
import {
  ApiError,
  IdParams,
  SubcategoryBody,
  SubcategoryResponse,
} from "../../../src/types/index";

export const getAllSubcategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
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

export const getSubcategoryById = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void> => {
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

export const upsertSubcategory = async (
  req: Request<IdParams, {}, SubcategoryBody>,
  res: Response,
): Promise<void> => {
  try {
    const data: Record<string, unknown> = {
      name: req.body.name,
      categoryId: req.body.categoryId,
    };
    if (req.params.id) data.subcategoryId = req.params.id;
    const [subcategory] = await Subcategory.upsert(data as any, {
      returning: true,
    });
    res.status(200).json(subcategory);
  } catch (error) {
    console.error("Error upserting subcategory:", error);
    res
      .status(500)
      .json({ error: "An error occurred while upserting the subcategory" });
  }
};

export const deleteSubcategory = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void> => {
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

/**
 * @swagger
 * tags:
 *   name: Subcategories
 *   description: Management of product subcategories
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

/**
 * @swagger
 * /subcategories/{id}:
 *   put:
 *     summary: Create or update a subcategory
 *     tags: [Subcategories]
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
 *             required: [name, categoryId]
 *             properties:
 *               name:
 *                 type: string
 *               categoryId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subcategory created or updated successfully
 *       500:
 *         description: Error upserting subcategory
 */

/**
 * @swagger
 * /subcategories/{id}:
 *   delete:
 *     summary: Delete a subcategory by ID
 *     tags: [Subcategories]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subcategory deleted successfully
 *       404:
 *         description: Subcategory not found
 *       500:
 *         description: Error deleting subcategory
 */
