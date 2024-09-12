
const { User } = require('../models');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({ email, password: hashedPassword });
        return res.status(201).json({ user: user });
    } catch (error) {
        return res.status(500).json({ error: 'User creation failed' });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
};

module.exports = {registerUser};
