const { Order , Product, OrderProduct } = require('../models');

const getOrderByCustomerId = async (req, res) => {
  try {
    const order = await OrderProduct.findAll({
      where: { customerId: req.params.id },
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
  try {
    const order = await OrderProduct.findAll({
      where: { orderId: req.params.id },
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
