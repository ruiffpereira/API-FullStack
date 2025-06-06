const { Order, Customer, Product } = require("../../../models");

const getAllOrders = async (req, res) => {
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

const getOrderById = async (req, res) => {
  const userId = req.user;
  try {
    const order = await Order.findAndCountAll({
      where: {
        orderId: req.params.id,
        userId,
      },
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

const getOrderByCustomerId = async (req, res) => {
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

const createOrder = async (req, res) => {
  const userId = req.user;
  try {
    const newOrder = await Order.create({ ...req.body, userId });
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the order" });
  }
};

const updateOrder = async (req, res) => {
  const userId = req.user;
  try {
    const [updated] = await Order.update(req.body, {
      where: { id: req.params.id, userId },
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

const deleteOrder = async (req, res) => {
  const userId = req.user;
  try {
    const deleted = await Order.destroy({
      where: { id: req.params.id, userId },
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

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderByCustomerId,
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
 *                   description: Total number of orders
 *                 rows:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       500:
 *         description: Error fetching orders
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
 *         description: ID of the order
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
 *         description: Error fetching the order
 */

/**
 * @swagger
 * /orders/customerid/{id}:
 *   get:
 *     summary: Get all orders by customer ID
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the customer
 *     responses:
 *       200:
 *         description: List of orders for the customer
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Order'
 *                   - type: object
 *                     properties:
 *                       customer:
 *                         $ref: '#/components/schemas/Customer'
 *       404:
 *         description: Orders not found for the customer
 *       500:
 *         description: Error fetching orders
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
 *                 description: ID of the customer
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID of the product
 *                     quantity:
 *                       type: integer
 *                       description: Quantity of the product
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
 *     summary: Update an order
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Updated status of the order
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                       description: ID of the product
 *                     quantity:
 *                       type: integer
 *                       description: Updated quantity of the product
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
 *     summary: Delete an order
 *     tags: [Orders]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order to delete
 *     responses:
 *       204:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error deleting order
 */
