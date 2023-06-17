const jwt = require('jsonwebtoken');

// Middleware function to verify JWT
const verifyToken = (req, res, next) => {
  let token = req.headers.authorization 
  if(token.split(" ")[0] === "Bearer"){
    token = req.headers.authorization.split(" ")[1];
  }

  console.log(token);
  if (!token) {
    return res.status(401).json({valid: false, msg: 'Access denied. No token provided.'});
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    console.log("decoded", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({valid: false, msg: 'Invalid token.'});
  }
};

module.exports = verifyToken;

