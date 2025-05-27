const { Product, Category, Subcategory } = require("../../../models");
const { v4: uuidv4 } = require("uuid");
const path = require("path"); // Importar o módulo path
const fs = require("fs"); // Importar o módulo fs para manipulação de arquivos

const getAllProducts = async (req, res) => {
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

const getProductById = async (req, res) => {
  const userId = req.user;
  //console.log("id:", req.params);
  try {
    const product = await Product.findOne({
      where: { productId: req.params.id, userId },
      include: [
        { model: Category, as: "category" },
        { model: Subcategory, as: "subcategory" },
      ],
    });
    //console.log("Product found:", product);

    if (product) {
      //console.log("Product found:", product);
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

const createProduct = async (req, res) => {
  const userId = req.user;

  const { ...fields } = req.body;

  console.log(fields);

  const validFields = {};
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

  updatableFields.forEach((field) => {
    if (
      fields[field] !== undefined &&
      fields[field] !== "" &&
      fields[field] !== "undefined"
    ) {
      validFields[field] = fields[field];
    }
  });

  // console.log(updatableFields);
  // console.log(validFields);

  // Inicializar validFields.photos como um array vazio
  validFields.photos = validFields.photos || [];

  // Adicionar novas fotos
  if (req.files && Object.keys(req.files).length > 0) {
    let photos = req.files.photos;
    if (!Array.isArray(photos)) {
      photos = [photos]; // Se não for um array, transforme em um array
    }
    if (photos.length > 0) {
      const newPhotos = photos.map((file) => {
        const uniqueName = uuidv4() + path.extname(file.name); // Gerar um nome único para o arquivo
        const uploadPath = "./uploads/" + uniqueName;
        file.mv(uploadPath, (err) => {
          if (err) {
            console.log(err);
            return res.status(500).json({ error: err.message });
          }
        });
        return uploadPath;
      });
      validFields.photos = [...validFields.photos, ...newPhotos];
    }
  }

  validFields.userId = userId;

  try {
    const newProduct = await Product.create(validFields);
    console.log("sucesso");
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the product" });
  }
};

const updateProduct = async (req, res) => {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const userId = req.user;
  const fields = req.body;

  if (!req.params.id) {
    return res.status(400).json({ message: "ID é necessário" });
  }

  try {
    // Buscar produto atual
    const product = await Product.findOne({
      where: { productId: req.params.id, userId },
    });

    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado" });
    }

    // Fotos atuais
    let updatedPhotos = Array.isArray(product.photos)
      ? [...product.photos]
      : [];

    if (fields.photosToRemove) {
      const photosToRemove = Array.isArray(fields.photosToRemove)
        ? fields.photosToRemove
        : fields.photosToRemove
          ? [fields.photosToRemove]
          : [];

      photosToRemove.forEach((photoPath) => {
        // Remove do array
        updatedPhotos = updatedPhotos.filter((p) => p !== photoPath);
        // Remove do disco
        const fullPath = path.join(
          process.cwd(),
          "uploads",
          path.basename(photoPath)
        );
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.log(`Erro ao remover a foto: ${fullPath}`, err);
          } else {
            //console.log(`Foto removida: ${fullPath}`);
          }
        });
      });
    }

    //console.log("Fotos atualizadas após remoção:", updatedPhotos);

    // 2. Adicionar novas fotos do upload (igual ao método de criar)
    if (req.files && req.files.photos) {
      let photos = req.files.photos;
      if (!Array.isArray(photos)) photos = [photos];
      const newPhotos = photos.map((file) => {
        const uniqueName = uuidv4() + path.extname(file.name);
        const uploadPath = "./uploads/" + uniqueName;
        file.mv(uploadPath, (err) => {
          if (err) {
            console.log(err);
          }
        });
        return uploadPath;
      });
      updatedPhotos = [...updatedPhotos, ...newPhotos];
    }

    if (fields.subcategoryId === "") {
      fields.subcategoryId = null;
    }

    // Atualizar os outros campos normalmente
    const updatableFields = [
      "name",
      "reference",
      "stock",
      "price",
      "description",
      "categoryId",
      "subcategoryId",
    ];
    const validFields = {};
    updatableFields.forEach((field) => {
      if (
        fields[field] !== undefined &&
        fields[field] !== "" &&
        fields[field] !== "undefined"
      ) {
        validFields[field] = fields[field];
      }
    });

    console.log("Campos:", fields);
    console.log("Campos válidos para atualização:", validFields);

    validFields.photos = updatedPhotos;

    // Atualizar produto
    await Product.update(validFields, {
      where: { productId: req.params.id, userId },
    });

    res.status(200).json({ message: "Produto atualizado com sucesso" });
  } catch (error) {
    let errorMessage;
    if (error.name === "SequelizeForeignKeyConstraintError") {
      errorMessage = `Foreign key constraint error: ${error.message}`;
    } else {
      errorMessage = `Error updating product: ${error.message}`;
    }
    res.status(500).json({ error: errorMessage, details: error.message });
  }
};

const deleteProduct = async (req, res) => {
  const userId = req.user;
  try {
    // Buscar o produto e suas imagens
    const product = await Product.findOne({
      where: { productId: req.params.id, userId },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    //Verificar e remover as fotos associadas ao produto
    if (product.photos && product.photos.length > 0) {
      product.photos.forEach((photoPath) => {
        const fullPath = path.resolve(
          __dirname,
          "..",
          "uploads",
          path.basename(photoPath)
        );
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.log(`Erro ao remover a foto: ${fullPath}`, err);
          } else {
            console.log(`Foto removida: ${fullPath}`);
          }
        });
      });
    }

    // Deletar o produto
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

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
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
 *                   description: Total number of products
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
 *         description: ID of the product
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the product
 *               reference:
 *                 type: string
 *                 description: Reference code of the product
 *               stock:
 *                 type: integer
 *                 description: Stock quantity
 *               photos:
 *                 type: array
 *                 description: List of photo URLs of the product
 *                 items:
 *                   type: string
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Price of the product
 *               description:
 *                 type: string
 *                 description: Description of the product
 *               categoryId:
 *                 type: string
 *                 description: ID of the associated category
 *               subcategoryId:
 *                 type: string
 *                 description: ID of the associated subcategory
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
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name of the product
 *               stock:
 *                 type: integer
 *                 description: Updated stock quantity
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Updated price of the product
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
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product to delete
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Error deleting product
 */
