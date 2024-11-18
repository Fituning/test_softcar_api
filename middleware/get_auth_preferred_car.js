
const Car = require('../models/car');
const auth = require("./auth");
const {UserRole, RoleLevels} = require("../enums/user_enum");
const response = require("../utils");

module.exports = (req, res, next) => {
    auth(req, res, () => {
        const user = req.auth.user;

        if (RoleLevels[user.role]  >= RoleLevels[UserRole.ADMIN]) {

            let carId = req.params.id || req.query.id;
            if (!carId) {
                carId = user.preferences.car // Supporte soit le paramètre de route, soit le query parameter
                if (!carId) {
                    return res.status(400).json(response(false,'Car ID is required'));
                }
            }

            Car.findById(carId).then((car) => {
                req.car = car;
                next();
            }).catch((error) => {
                res.status(404).json(response(false,null,null, error));
            })
        }else {
            const carId = user.preferences.selected_car
            if (!carId) {
                return res.status(404).json(response(false , 'No Car selected'));
            }else {
                Car.findById(carId).then((car) => {
                    req.car = car;
                    next();
                }).catch((error) => {
                    res.status(404).json(response(false,"Car not found", null, error));
                })
            }
        }
    });
}