const { Customer, User } = require('../models');
const jwt = require('jsonwebtoken');

const loginCustomer = async (req, res, next) => {
  try {
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
    const token = jwt.sign({ customerId: customer.customerId, userId: user.userId  }, user.secretkeysite, { expiresIn: '7d' });
    res.json({customer, token});
    next(); // Chama o próximo middleware (NextAuth)

  } catch (error) {
    console.error('Error fetching or creating customer:', error);
    res.status(500).json({ error: 'An error occurred while fetching or creating the customer' });
  }
};
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAndCountAll();
    res.json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ error: 'An error occurred while fetching customers' });
  }
};
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.id);
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
const createCustomer = async (req, res) => {
  try {
    const newCustomer = await Customer.create(req.body);
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'An error occurred while creating the customer' });
  }
};
const updateCustomer = async (req, res) => {
  try {
    const [updated] = await Customer.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedCustomer = await Customer.findByPk(req.params.id);
      res.json(updatedCustomer);
    } else {
      res.status(404).json({ error: 'Customer not found' });
    }
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ error: 'An error occurred while updating the customer' });
  }
};
const deleteCustomer = async (req, res) => {
  try {
    const deleted = await Customer.destroy({
      where: { id: req.params.id }
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
  loginCustomer,
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
