const jwt = require('jsonwebtoken');
const User = require("../models/user");

const response = require("../utils");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        User.findById(userId).then((user) => {
            if (!user) {
                return res.status(401).json(response(false,"User unknown"));
            }

            req.auth = {
                userId: userId,
                user : user,
            };
            next();
        }).catch((error) => {
            res.status(404).json(response(false,null,null,error));
        })
    } catch(error) {
        res.status(401).json(response(false,null,null,error));
    }
};