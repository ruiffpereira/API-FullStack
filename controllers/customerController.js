const { Customer } = require('../models');

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

const createCustomer = async (req, res) => {
  const userId = req.user;
  try {
    const newCustomer = await Customer.create({...req.body, userId});
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error('Error creating customer:', error);
    res.status(500).json({ error: 'An error occurred while creating the customer' });
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
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
