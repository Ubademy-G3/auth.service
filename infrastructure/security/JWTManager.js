const jwt = require("jsonwebtoken");

module.exports = {
  async generateToken(userId) {
    return jwt.sign(userId, process.env.JWT_SECRET_KEY);
  },

  async verifyToken(accessToken) {
    return jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
  },
};
