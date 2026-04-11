import { Request, Response } from "express";
import { Order, Product, OrderProduct } from "../../../models";
import { ApiError, IdParams } from "../../../src/types/index";

export const getOrderByCustomerId = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void> => {
  const userId = req.user;
  try {
    const order = await OrderProduct.findAll({
      where: { customerId: req.params.id, userId } as any,
      include: [{ model: Order, as: "orders" }],
    });
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the order" });
  }
};

export const getOrderByOrderId = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void> => {
  const userId = req.user;
  try {
    const order = await OrderProduct.findAll({
      where: { orderId: req.params.id } as any,
      include: [{ model: Product, as: "product" }],
    });
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the order" });
  }
};

export const getOrdersByProductId = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void> => {
  const userId = req.user;
  try {
    const orders = await OrderProduct.findAll({
      where: { productId: req.params.id },
      include: [{ model: Order, as: "orders", where: { userId } }],
    });
    if (orders) {
      res.json(orders);
    } else {
      res.status(404).json({ error: "Orders not found for this product" });
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the orderss" });
  }
};

/**
 * @swagger
 * tags:
 *   name: OrderProducts
 *   description: Management of order product relations
 */

/**
 * @swagger
 * /ordersproduct/orderid/{id}:
 *   get:
 *     summary: Get products for a specific order
 *     tags: [OrderProducts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: List of order products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderProduct'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error fetching order
 */

/**
 * @swagger
 * /ordersproduct/productid/{id}:
 *   get:
 *     summary: Get orders containing a specific product
 *     tags: [OrderProducts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of order products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderProduct'
 *       404:
 *         description: Orders not found for this product
 *       500:
 *         description: Error fetching orders
 */

/**
 * @swagger
 * /ordersproduct/{id}:
 *   get:
 *     summary: Get order products by customer ID
 *     tags: [OrderProducts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: List of order products
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error fetching order
 */
