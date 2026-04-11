import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { Product, Category, Subcategory } from "../../../models";
import {
  ApiError,
  IdParams,
  ProductBody,
  ProductResponse,
} from "../../../src/types/index";
import { UploadedFile } from "express-fileupload";

export const getAllProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user;
  try {
    const products = await Product.findAndCountAll({
      where: { userId },
      include: [
        { model: Category, as: "category" },
        { model: Subcategory, as: "subcategory" },
      ],
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching products" });
  }
};

export const getProductById = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void> => {
  const userId = req.user;
  try {
    const product = await Product.findOne({
      where: { productId: req.params.id, userId },
      include: [
        { model: Category, as: "category" },
        { model: Subcategory, as: "subcategory" },
      ],
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the product" });
  }
};

export const createProduct = async (
  req: Request<{}, {}, ProductBody>,
  res: Response,
): Promise<void | Response> => {
  const userId = req.user;
  const fields = req.body;
  const updatableFields = [
    "name",
    "reference",
    "photos",
    "stock",
    "price",
    "description",
    "categoryId",
    "subcategoryId",
  ];
  const validFields: Record<string, unknown> = {};
  updatableFields.forEach((field) => {
    if (
      fields[field] !== undefined &&
      fields[field] !== "" &&
      fields[field] !== "undefined"
    ) {
      validFields[field] = fields[field];
    }
  });
  validFields.photos = (validFields.photos as string[]) || [];
  if ((req as any).files && Object.keys((req as any).files).length > 0) {
    let photos = (req as any).files.photos as UploadedFile | UploadedFile[];
    if (!Array.isArray(photos)) photos = [photos];
    const newPhotos = (photos as UploadedFile[]).map((file) => {
      const uniqueName = uuidv4() + path.extname(file.name);
      const uploadPath = "./uploads/" + uniqueName;
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
      const ext = path.extname(file.name).toLowerCase();
      const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
      ];

      if (!allowedMimeTypes.includes(file.mimetype)) {
        res.status(400).json({ error: "Tipo de ficheiro não permitido" });
        return;
      }
      if (!allowedExtensions.includes(ext)) {
        res.status(400).json({ error: "Tipo de ficheiro não permitido" });
        return;
      }
      file.mv(uploadPath, (err: any) => {
        if (err) console.log(err);
      });
      return uploadPath;
    });
    validFields.photos = [...(validFields.photos as string[]), ...newPhotos];
  }
  validFields.userId = userId;
  try {
    const newProduct = await Product.create(validFields as any);
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the product" });
  }
};

export const updateProduct = async (
  req: Request<IdParams, {}, ProductBody>,
  res: Response,
): Promise<void | Response> => {
  if (req.method !== "PUT")
    return res.status(405).json({ message: "Método não permitido" });
  const userId = req.user;
  const fields = req.body;
  if (!req.params.id)
    return res.status(400).json({ message: "ID é necessário" });
  try {
    const product = await Product.findOne({
      where: { productId: req.params.id, userId },
    });
    if (!product)
      return res.status(404).json({ message: "Produto não encontrado" });

    let updatedPhotos: string[] = Array.isArray(product.photos)
      ? [...(product.photos as string[])]
      : [];

    if (fields.photosToRemove) {
      const photosToRemove: string[] = Array.isArray(fields.photosToRemove)
        ? fields.photosToRemove
        : [fields.photosToRemove];
      photosToRemove.forEach((photoPath) => {
        updatedPhotos = updatedPhotos.filter((p) => p !== photoPath);
        const fullPath = path.join(
          process.cwd(),
          "uploads",
          path.basename(photoPath),
        );
        fs.unlink(fullPath, (err) => {
          if (err) console.log(`Erro ao remover a foto: ${fullPath}`, err);
        });
      });
    }

    if ((req as any).files && (req as any).files.photos) {
      let photos = (req as any).files.photos as UploadedFile | UploadedFile[];
      if (!Array.isArray(photos)) photos = [photos];
      const newPhotos = (photos as UploadedFile[]).map((file) => {
        const uniqueName = uuidv4() + path.extname(file.name);
        const uploadPath = "./uploads/" + uniqueName;
        file.mv(uploadPath, (err: any) => {
          if (err) console.log(err);
        });
        return uploadPath;
      });
      updatedPhotos = [...updatedPhotos, ...newPhotos];
    }

    if (fields.subcategoryId === "") fields.subcategoryId = null;

    const updatableFields = [
      "name",
      "reference",
      "stock",
      "price",
      "description",
      "categoryId",
      "subcategoryId",
    ];
    const validFields: Record<string, unknown> = {};
    updatableFields.forEach((field) => {
      if (
        fields[field] !== undefined &&
        fields[field] !== "" &&
        fields[field] !== "undefined"
      ) {
        validFields[field] = fields[field];
      }
    });
    validFields.photos = updatedPhotos;

    await Product.update(validFields as any, {
      where: { productId: req.params.id, userId },
    });
    res.status(200).json({ message: "Produto atualizado com sucesso" });
  } catch (error: any) {
    const errorMessage =
      error.name === "SequelizeForeignKeyConstraintError"
        ? `Foreign key constraint error: ${error.message}`
        : `Error updating product: ${error.message}`;
    res.status(500).json({ error: errorMessage, details: error.message });
  }
};

export const deleteProduct = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void | Response> => {
  const userId = req.user;
  try {
    const product = await Product.findOne({
      where: { productId: req.params.id, userId },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    if (product.photos && (product.photos as string[]).length > 0) {
      (product.photos as string[]).forEach((photoPath) => {
        const fullPath = path.resolve(
          __dirname,
          "..",
          "uploads",
          path.basename(photoPath),
        );
        fs.unlink(fullPath, (err) => {
          if (err) console.log(`Erro ao remover a foto: ${fullPath}`, err);
        });
      });
    }
    const deleted = await Product.destroy({
      where: { productId: req.params.id, userId },
    });
    res.json({ deleted });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the product" });
  }
};

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Management of products
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
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
 *                     $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error fetching products
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error fetching product
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               reference:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               subcategoryId:
 *                 type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       500:
 *         description: Error creating product
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               description:
 *                 type: string
 *               categoryId:
 *                 type: string
 *               subcategoryId:
 *                 type: string
 *               photosToRemove:
 *                 type: array
 *                 items:
 *                   type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error updating product
 */

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error deleting product
 */
