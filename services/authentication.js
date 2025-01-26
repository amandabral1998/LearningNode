const jwt = require('jsonwebtoken');
require('dotenv').config();



const createTokenForUser = (user) => {
    const payload = {
        _id: user._id,
        email: user.email,
        name: user.fullName,
        role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);
    
    return token;
};

const validateToken = (token) => {
    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        return verified;
    } catch (error) {
        console.error('Token validation error:', error);
        throw error;
    }
};

module.exports = {
    validateToken,
    createTokenForUser
};
