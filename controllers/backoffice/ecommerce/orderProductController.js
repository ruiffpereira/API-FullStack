const { Order, Product, OrderProduct } = require("../../../models");

const getOrderByCustomerId = async (req, res) => {
  const userId = req.user;
  try {
    const order = await OrderProduct.findAll({
      where: { customerId: req.params.id, userId },
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

const getOrderByOrderId = async (req, res) => {
  const userId = req.user;
  try {
    const order = await OrderProduct.findAll({
      where: { orderId: req.params.id, userId },
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

const getOrdersByProductId = async (req, res) => {
  const userId = req.user;
  try {
    const orders = await OrderProduct.findAll({
      where: { productId: req.params.id },
      include: [
        {
          model: Order,
          as: "orders",
          where: { userId }, // Filtra as orders pelo userId do usuário autenticado
        },
      ],
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

module.exports = {
  getOrderByCustomerId,
  getOrderByOrderId,
  getOrdersByProductId,
};

/**
 * @swagger
 * tags:
 *   name: OrderProducts
 *   description: Management of orders and their products
 */

/**
 * @swagger
 * /ordersproduct/customer/{id}:
 *   get:
 *     summary: Get all orders by customer ID
 *     tags: [OrderProducts]
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
 *                 $ref: '#/components/schemas/OrderProduct'
 *       404:
 *         description: Orders not found for the customer
 *       500:
 *         description: Error fetching orders
 */

/**
 * @swagger
 * /ordersproduct/order/{id}:
 *   get:
 *     summary: Get all products in an order by order ID
 *     tags: [OrderProducts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the order
 *     responses:
 *       200:
 *         description: List of products in the order
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderProduct'
 *       404:
 *         description: Order not found
 *       500:
 *         description: Error fetching the order
 */

/**
 * @swagger
 * /ordersproduct/productid/{id}:
 *   get:
 *     summary: Get all orders for a product by product ID
 *     tags: [OrderProducts]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the product
 *     responses:
 *       200:
 *         description: List of orders for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OrderProduct'
 *       404:
 *         description: Orders not found for the product
 *       500:
 *         description: Error fetching orders
 */
