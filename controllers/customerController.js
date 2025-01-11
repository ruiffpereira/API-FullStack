const { Customer, User } = require('../models');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

const getAllCustomers = async (req, res) => {
  const userId = req.user;

  try {
    const customers = await Customer.findAndCountAll({
      where: {
        userId: userId
      }
    });
    console.log("Sucess fetching customers:", customers);
    res.status(201).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'An error occurred while fetching customers' });
  }
};

const getCustomerById = async (req, res) => {
  const userId = req.user;
  try {
    const customer = await Customer.findByPk.findOne({
      where: {
        id: req.params.id,
        userId
      }
    });
    if (customer) {
      res.json(customer);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ error: 'An error occurred while fetching the customer' });
  }
};

const loginCustomer = async (req, res, next) => {
  try {
    console.log("body: ", req.body);
    const { secretkeysite } = req.body;
    const { name, email, contact , image} = req.body.user;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({
      where: { secretkeysite }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found for the given website key' });
    }

    let customer = await Customer.findOne({
      where: {
        userId: user.userId,
        email
      },
      attributes: ['customerId','name', 'contact', 'email', 'photo']
    });

    if (!customer) {

      customer = await Customer.create({
        email,
        name : name || 'N/A',
        contact: contact || 'N/A',
        photo : image || 'N/A',
        userId: user.userId
      });

      customer = await Customer.findOne({
        where: {
          userId: user.userId,
          email
        },
        attributes: ['customerId','name', 'contact', 'email', 'photo'] 
      });
    }

    // Gerar token JWT
    const token = jwt.sign({ userId: user.userId }, JWT_SECRET, { expiresIn: '7d' });
    res.cookie('token-bo', token, { httpOnly: true });
    res.json({customer, token});
    next(); // Chama o próximo middleware (NextAuth)

  } catch (error) {
    console.error('Error fetching or creating customer:', error);
    res.status(500).json({ error: 'An error occurred while fetching or creating the customer' });
  }
};

const updateCustomer = async (req, res) => {
  const userId = req.user;
  try {
    const [updated] = await Customer.update(req.body, {
      where: { id: req.params.id, userId }
    });
    if (updated) {
      const updatedCustomer = await Customer.findByPk(req.params.id);
      res.status(201).json(updatedCustomer);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'An error occurred while updating the customer' });
  }
};

const deleteCustomer = async (req, res) => {
  const userId = req.user;
  try {
    const deleted = await Customer.destroy({
      where: { id: req.params.id, userId }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({ error: 'An error occurred while deleting the customer' });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById,
  loginCustomer,
  updateCustomer,
  deleteCustomer,
};
