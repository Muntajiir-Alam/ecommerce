function role(...allowedRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "You don't have access" });
        }

        return next();
    };
}

export { role };
