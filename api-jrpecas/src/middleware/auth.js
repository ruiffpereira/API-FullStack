const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  // console.log(token)
  if (!token) {
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log("nao passou")
      return res.sendStatus(403); // Forbidden
    }
    
    req.user = user.userId;

    next();
  });
};

module.exports = authenticateToken;