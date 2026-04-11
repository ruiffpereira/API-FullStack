import { Request, Response } from "express";
import { Product, Cart, CartProduct } from "../../../models";
import { ApiError, CartBody, CartResponse } from "../../../src/types/index";

const calculateCartTotals = async (cart: Cart) => {
  const cartData = await Cart.findOne({
    where: { cartId: cart.cartId },
    attributes: [],
    include: [
      {
        model: CartProduct,
        as: "cartProducts",
        attributes: ["quantity"],
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["productId", "name", "price", "photos"],
          },
        ],
      },
    ],
    order: [
      [
        { model: CartProduct, as: "cartProducts" },
        { model: Product, as: "product" },
        "name",
        "ASC",
      ],
    ],
  });

  let shipPrice = 0;
  const products =
    (cartData as any)?.cartProducts?.map((cartProduct: any) => {
      const productPrice = parseFloat(cartProduct.product.price);
      shipPrice += productPrice * cartProduct.quantity;
      return {
        productId: cartProduct.product.productId,
        name: cartProduct.product.name,
        price: cartProduct.product.price,
        photos: cartProduct.product.photos,
        quantity: cartProduct.quantity,
      };
    }) || [];

  return { products, shipPrice };
};

export const addProductToCart = async (
  req: Request<{}, {}, CartBody>,
  res: Response,
): Promise<void> => {
  const { productId, quantity } = req.body;
  const { customerId } = req;
  try {
    const quantityInt = Number(quantity);
    if (isNaN(quantityInt)) {
      res.status(400).json({ error: "Invalid quantity" });
      return;
    }

    let cart = await Cart.findOne({ where: { customerId } });
    if (!cart) cart = await Cart.create({ customerId: customerId! });

    let cartProduct = await CartProduct.findOne({
      where: { cartId: cart.cartId, productId },
    });

    if (cartProduct) {
      if (quantityInt === -1) {
        await cartProduct.destroy();
      } else if (quantityInt === 0) {
        if (cartProduct.quantity > 1) {
          cartProduct.quantity -= 1;
          await cartProduct.save();
        } else {
          await cartProduct.destroy();
        }
      } else if (quantityInt === 1) {
        cartProduct.quantity += 1;
        await cartProduct.save();
      } else {
        res.status(400).json({ error: "Invalid quantity operation" });
        return;
      }
    } else {
      if (quantityInt === 1) {
        await CartProduct.create({
          cartId: cart.cartId,
          productId,
          quantity: 1,
        });
      } else {
        res
          .status(400)
          .json({ error: "Invalid operation for a product not in the cart" });
        return;
      }
    }

    const cartUpdated = await calculateCartTotals(cart);
    res.status(200).json({
      cartId: cart.cartId,
      custormerId: cart.customerId,
      products: cartUpdated.products,
      shipPrice: cartUpdated.shipPrice,
    });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({
      error: "An error occurred while adding the product to the cart",
    });
  }
};

export const getCartItems = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { customerId } = req;
  try {
    let cart = await Cart.findOne({ where: { customerId } });
    if (!cart) cart = await Cart.create({ customerId: customerId! });
    const cartUpdated = await calculateCartTotals(cart);
    res.status(200).json({
      cartId: cart.cartId,
      custormerId: cart.customerId,
      products: cartUpdated.products,
      shipPrice: cartUpdated.shipPrice,
    });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the cart items" });
  }
};

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Management of the customer shopping cart
 */

/**
 * @swagger
 * /websites/ecommerce/carts:
 *   post:
 *     summary: Add, remove or update a product in the cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId, quantity]
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 description: "1 to add, 0 to decrease by 1, -1 to remove"
 *     responses:
 *       200:
 *         description: Cart updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       400:
 *         description: Invalid quantity or operation
 *       500:
 *         description: Error updating cart
 */

/**
 * @swagger
 * /websites/ecommerce/carts:
 *   get:
 *     summary: Get the current customer's cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Error fetching cart
 */
