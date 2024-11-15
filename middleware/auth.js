const jwt = require('jsonwebtoken');
const User = require("../models/user");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        User.findById(userId).then((user) => {
            if (!user) {
                return res.status(401).json({ error : "User unknown" });
            }

            req.auth = {
                userId: userId,
                user : user,
            };
            next();
        }).catch((error) => {
            res.status(404).json({ error: error.message });
        })
    } catch(error) {
        res.status(401).json({ error : error.message });
    }
};