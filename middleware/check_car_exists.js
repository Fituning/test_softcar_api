
const User = require('../models/user');
const jwt = require("jsonwebtoken"); // Importez le modèle de la voiture

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;

        User.findById(userId).then((user) => {
            if (!user) {
                return res.status(404).json({ error: 'User not connected' });
            }
            const carId = req.params.id || req.query.id; // Supporte soit le paramètre de route, soit le query parameter
            if (!carId) {
                return res.status(400).json({ error: 'Car ID is required' });
            }
            if (user.cars.includes(carId)) {
                console.log(user.cars.find((car) => car.id === carId));
                req.car = user.cars.find((car) => car.id === carId);
                next();
            }else{
                return res.status(404).json({ error: 'Car is not yours' });
            }
        }).catch((error) => {
            res.status(400).json({ error: error.message });
        })
    } catch(error) {
        res.status(401).json({ error : error.message });
    }
};