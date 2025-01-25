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

module.exports = {
  loginCustomer,
};
