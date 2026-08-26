import jwt from 'jsonwebtoken';

function getToken(req) {
    const cookieToken = req.cookies?.token;
    const authorization =
        req.get?.('authorization') || req.headers?.authorization;

    if (cookieToken) {
        return cookieToken;
    }

    if (authorization?.startsWith('Bearer ')) {
        return authorization.slice('Bearer '.length);
    }

    return null;
}

function auth(req, res, next) {
    const token = getToken(req);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (typeof decoded !== 'object' || !decoded.id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = decoded;
        return next();
    } catch {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

export { auth };
