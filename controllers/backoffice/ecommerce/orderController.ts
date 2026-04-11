import { Request, Response } from "express";
import { Order, Customer, Product } from "../../../models";
import {
  ApiError,
  IdParams,
  OrderBody,
  OrderResponse,
} from "../../../src/types/index";

export const getAllOrders = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const userId = req.user;
  try {
    const orders = await Order.findAndCountAll({
      where: { userId },
      include: [{ model: Customer, as: "customer" }],
    });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "An error occurred while fetching orders" });
  }
};

export const getOrderById = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void> => {
  const userId = req.user;
  try {
    const order = await Order.findAndCountAll({
      where: { orderId: req.params.id, userId },
      include: [
        { model: Customer, as: "customer" },
        { model: Product, as: "products" },
      ],
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

export const getOrderByCustomerId = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void> => {
  const userId = req.user;
  try {
    const order = await Order.findAll({
      where: { customerId: req.params.id, userId },
      include: [{ model: Customer, as: "customer" }],
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

export const createOrder = async (
  req: Request<{}, {}, OrderBody>,
  res: Response,
): Promise<void> => {
  const userId = req.user;
  try {
    const newOrder = await Order.create({
      ...req.body,
      userId: userId!,
      customerId: req.body.customerId!,
    });
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the order" });
  }
};

export const updateOrder = async (
  req: Request<IdParams, {}, OrderBody>,
  res: Response,
): Promise<void> => {
  const userId = req.user;
  try {
    const [updated] = await Order.update(req.body, {
      where: { orderId: req.params.id, userId },
    });
    if (updated) {
      const updatedOrder = await Order.findByPk(req.params.id);
      res.json(updatedOrder);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error("Error updating order:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the order" });
  }
};

export const deleteOrder = async (
  req: Request<IdParams>,
  res: Response,
): Promise<void> => {
  const userId = req.user;
  try {
    const deleted = await Order.destroy({
      where: { orderId: req.params.id, userId },
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    console.error("Error deleting order:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the order" });
  }
};

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Management of orders
 */

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: List of orders
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
 *                     $ref: '#/components/schemas/Order'
 *       500:
 *         description: Error fetching orders
 */

/**
 * @swagger
 * /orders/customerid/{id}:
 *   get:
 *     summary: Get orders by customer ID
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of orders for the customer
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error fetching order
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error fetching order
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Order created successfully
 *       500:
 *         description: Error creating order
 */

/**
 * @swagger
 * /orders/{id}:
 *   put:
 *     summary: Update an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error updating order
 */

/**
 * @swagger
 * /orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error deleting order
 */
