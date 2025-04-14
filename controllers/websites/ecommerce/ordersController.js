const { Order, OrderProduct, Cart, Product } = require('../../../models');

const createOrder = async (req, res) => {
  const { customerId, userId } = req;

  try {
    // 1. Buscar os produtos no carrinho do cliente
    const cartItems = await Cart.findAll({
      where: { customerId },
      include: [{ model: Product, as: 'product' }],
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    // 2. Calcular o preço total
    const totalPrice = cartItems.reduce((total, item) => {
      return total + item.product.price * item.quantity;
    }, 0);

    // 3. Criar a encomenda
    const newOrder = await Order.create({
      customerId,
      userId,
      price: totalPrice, // Preço total da encomenda
    });

    // 4. Criar os itens da encomenda
    const orderProducts = cartItems.map((item) => ({
      orderId: newOrder.orderId,
      productId: item.productId,
      quantity: item.quantity,
      priceAtPurchase: item.product.price, // Preço do produto no momento da compra
    }));

    await OrderProduct.bulkCreate(orderProducts);

    // 5. Remover os itens do carrinho
    await Cart.destroy({ where: { customerId } });

    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'An error occurred while creating the order' });
  }
};

module.exports = {
  createOrder,
}

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order based on the customer's cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: [] # Requer autenticação com token
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order created successfully
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Cart is empty
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Cart is empty
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Customer not found
 *       500:
 *         description: An error occurred while creating the order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while creating the order
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         orderId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the order
 *         customerId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the customer
 *         userId:
 *           type: string
 *           format: uuid
 *           description: Unique identifier for the user who created the order
 *         price:
 *           type: number
 *           format: float
 *           description: Total price of the order
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the order was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the order was last updated
 */