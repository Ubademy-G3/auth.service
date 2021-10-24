const jwt = require('jsonwebtoken');

module.exports = {
    async generateToken(userId) {
        return jwt.sign(userId, process.env.JWT_SECRET)
    }
}

module.exports = {
    async verifyToken(accessToken) {
        return jwt.verify(accessToken, JWT_SECRET_KEY);
    }
}