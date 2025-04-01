const { Order , Product, OrderProduct } = require('../../../models');

const getOrderByCustomerId = async (req, res) => {
  const userId = req.user;
  try {
    const order = await OrderProduct.findAll({
      where: { customerId: req.params.id, userId },
      include: [
        { model: Order, as: 'orders' },
      ]
    });
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'An error occurred while fetching the order' });
  }
};

const getOrderByOrderId = async (req, res) => {
  const userId = req.user;
  try {
    const order = await OrderProduct.findAll({
      where: { orderId: req.params.id, userId },
      include: [
        { model: Product, as: 'product' },
      ]
    });
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'An error occurred while fetching the order' });
  }
};

module.exports = {
  getOrderByCustomerId,
  getOrderByOrderId
};

/**
 * @swagger
 * tags:
 *   name: OrderProducts
 *   description: Management of orders and their products
 */

/**
 * @swagger
 * /order-products/customer/{id}:
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
 * /order-products/order/{id}:
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