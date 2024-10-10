const jwt = require('jsonwebtoken');

// Function to generate a JWT token
const generateToken = (userId) => {
  const payload = { id: userId }; // Include user-specific data in payload if necessary
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }); // Token expires in 1 hour
};

module.exports = { generateToken };