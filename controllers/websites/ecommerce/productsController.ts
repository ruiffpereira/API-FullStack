import { Request, Response } from "express";
import { Product, User, Category, Subcategory } from "../../../models";

export const getAllProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const user = await User.findOne({ where: { userId: req.userId } });
    if (!user)
      return res
        .status(404)
        .json({ error: "User not found for the given secret key" });

    const products = await Product.findAll({
      where: { userId: user.userId },
      attributes: ["productId", "name", "price", "photos", "description"],
      include: [
        { model: Category, as: "category", attributes: ["categoryId", "name"] },
        {
          model: Subcategory,
          as: "subcategory",
          attributes: ["subcategoryId", "name"],
        },
      ],
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the products" });
  }
};

/**
 * @swagger
 * tags:
 *   name: WebsiteProducts
 *   description: Public product listing for website customers
 */

/**
 * @swagger
 * /websites/ecommerce/products:
 *   get:
 *     summary: Get all products for the website
 *     tags: [WebsiteProducts]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       404:
 *         description: User not found for the given secret key
 *       500:
 *         description: Error fetching products
 */
