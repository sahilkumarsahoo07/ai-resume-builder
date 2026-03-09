import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];

        // Development bypass
        if (token === 'mock-token-for-dev') {
            // Pure in-memory mock user to ensure ZERO database dependency
            req.user = {
                _id: '123456789012345678901234',
                name: 'Guest User',
                email: 'guest@example.com'
            };
            return next();
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
            req.user = await User.findById(decoded.userId).select('-password');
            return next();
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }
};
