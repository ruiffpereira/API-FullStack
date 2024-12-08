const { Order , Customer, Product } = require('../models');

const getAllOrders = async (req, res) => {
  const userId = req.user;
  console.log('userId:', userId);
  try {
    const orders = await Order.findAndCountAll({
      where: { userId },
      include: [
        { model: Customer, as: 'customer' }
      ]
    });
    console.log('orders:', orders);
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'An error occurred while fetching orders' });
  }
};

const getOrderById = async (req, res) => {
  const userId = req.user;
  try {
    const order = await Order.findAndCountAll({
      where:{
        orderId : req.params.id,
        userId
      },
      include: [
        { model: Customer, as: 'customer' },
        { model: Product, as: 'products' },
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

const getOrderByCustomerId = async (req, res) => {
  const userId = req.user;
  try {
    const order = await Order.findAll({
      where: { customerId: req.params.id , userId},
      include: [
        { model: Customer , as: 'customer'}
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

const createOrder = async (req, res) => {
  const userId = req.user;
  try {
    const newOrder = await Order.create({...req.body, userId});
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'An error occurred while creating the order' });
  }
};

const updateOrder = async (req, res) => {
  const userId = req.user;
  try {
    const [updated] = await Order.update(req.body, {
      where: { id: req.params.id, userId }
    });
    if (updated) {
      const updatedOrder = await Order.findByPk(req.params.id);
      res.json(updatedOrder);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'An error occurred while updating the order' });
  }
};

const deleteOrder = async (req, res) => {
  const userId = req.user;
  try {
    const deleted = await Order.destroy({
      where: { id: req.params.id , userId}
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'An error occurred while deleting the order' });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  getOrderByCustomerId
};
