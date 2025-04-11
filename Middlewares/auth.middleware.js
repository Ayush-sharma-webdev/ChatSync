const jwt = require('jsonwebtoken');
const userModel = require('../Models/user.model');
const blackListTokenModel = require('../Models/blacklisttoken.model');

module.exports.authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });
        }

        const isBlacklisted = await blackListTokenModel.findOne({ token });
        if (isBlacklisted) {
            return res.status(401).json({ message: 'Session expired. Please log in again.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id);

        if (!user) {
            return res.status(401).json({ message: 'User not found. Please log in again.' });
        }

        req.user = user;
        next();

    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized. Invalid or expired token.' });
    }
};