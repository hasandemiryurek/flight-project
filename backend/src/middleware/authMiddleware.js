const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'flyticket-secret-2024';

const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized', message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch {
        return res.status(401).json({ error: 'Unauthorized', message: 'Invalid or expired token' });
    }
};

module.exports = { verifyAdmin, JWT_SECRET };