export const auth = (roles = []) => {
    return (req, res, next) => {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            console.log('Not authenticated');
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const user = req.user;
        if (!user) {
            console.log('User not found');
            return res.status(403).json({ message: 'User not found' });
        }

        if (!roles.includes(user.rol)) {
            console.log(`Not authorized: role required ${roles}`);
            return res.status(403).json({ message: 'Not authorized' });
        }

        console.log(`Authorized: ${user.email} with role ${user.rol}`);
        next();
    };
};
