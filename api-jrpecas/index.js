const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { startDB } = require("./models");
const routes = require('./routes');
const cors = require('cors');
const { User } = require('./models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authenticateToken = require('./src/middleware/auth'); 

app.use(cors({
  origin: 'http://localhost:3000', // Substitua pelo domínio do seu frontend
  credentials: true, // Permite o envio de cookies
}))

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());

app.use('/api', routes);

app.post('/api/users/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ 
      where: { username },
      attributes: ['username', 'email', "password", "userId"],
     });

    if (!user) {
      return res.status(404).json({ error: 'Incorrect Data!' });
    }

    //const passwordMatch = await bcrypt.compare(password, user.password);
    const passwordMatch = password;
    
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Incorrect Data!' });
    }

    // Gerar token JWT
    const token = jwt.sign({ userId: user.userId }, 'teste');

    // Definir o cookie com o token
    res.cookie('tokenapi', token, { 
      httpOnly: true,
      // secure: true, // Certifique-se de que seu servidor está usando HTTPS
      sameSite: 'none'
    });

    return res.json({ userId: user.userId, username: user.username, email: user.email, token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error test' });
  }
});

app.listen({ port: 3001 }, async () => {
  startDB();
});
