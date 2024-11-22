require('dotenv').config();
const User = require('../models/user');
const Car = require('../models/car');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const response = require('../utils');

exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
            });
            user.save()
                .then(user => res.status(200).json(
                    response(
                        true,
                        "success",
                        {
                            userId: user._id,
                            token: jwt.sign(
                                { userId: user._id },
                                process.env.JWT_SECRET,
                                { expiresIn: process.env.JWT_TIME },
                            ),
                            user: user,
                        }
                    )
                ))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json(
                        response(
                        true,
                        "success",
                            {
                                userId: user._id,
                                token: jwt.sign(
                                    { userId: user._id },
                                    process.env.JWT_SECRET,
                                    { expiresIn: process.env.JWT_TIME },
                                ),
                                user: user,
                            }
                        )
                    );
                })
                .catch(error => res.status(500).json({ error: error.message }));
        })
        .catch(error => res.status(500).json({ error: error.message }));
};

exports.getUser = (req, res) => {
    const user = req.auth.user;

    return res.status(200).json(response(true, "User logged In", user));
}

exports.validateToken = (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (!decodedToken) {
            res.status(401).json(response(false,"Invalid Token"));
        }else{
            res.status(200).json(response(true, "the Token is valid"));
        }
    } catch(error) {
        res.status(401).json(response(false,null,null,error));
    }
}

exports.addCar = (req, res) => {
    // Rechercher la voiture par son VIN
    Car.findOne({ vin: req.body.vin }) // Corrigez `req.body.email` en `req.body.vin`
        .then((car) => {
            if (!car) {
                return res.status(401).json({ error: "Car not found" });
            }
            // Rechercher un utilisateur qui a cette voiture dans sa liste de véhicules
            // et dont l'ID n'est pas égal à `req.param.user`
            User.findOne({ cars: car._id}) // Exclure l'utilisateur spécifique
                .then((user) => {
                    if (!user){
                        User.findById(req.auth.userId).then(( loggedUser ) => {
                            if (!loggedUser) {
                                return res.status(401).json(response(false,"Utilisateur non trouvé !"));
                            }
                            loggedUser.cars.push(car._id);

                            if(loggedUser.cars.length <= 1){
                                loggedUser.preferences.selected_car = car._id ;
                            }
                            loggedUser.save()
                                .then(() => res.status(200).json(response(true, 'Added car to user succesfully', loggedUser)))
                                .catch(error => res.status(400).json(response(false,null, null, error)));
                        })
                    }else{
                        if(user._id.toString() === req.auth.userId){
                            return res.status(422).json(response(false,"You already owned this vehicle"));
                        }else{
                            return res.status(401).json(response(false,"this Vehicle is already owned by another user"));
                        }
                    }
                })
                .catch(error => res.status(500).json({ error: error.message }));
        })
        .catch(error => res.status(400).json({ error: error.message }));
};

exports.removeCar = (req, res) => {
    // Trouver l'utilisateur par son ID et remplir (populate) sa liste de voitures
    User.findById(req.auth.userId).populate("cars").then((user) => {
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const carToRemove = user.cars.find((car) => car.vin === req.body.vin);
        if(!carToRemove){
            return res.status(404).json({ error: "Car not found in user's list" });
        }
        user.cars.remove(carToRemove);

        // Enregistrer les modifications de l'utilisateur
        user.save()
            .then(() => res.status(200).json({ message: "Car removed successfully" }))
            .catch(error => res.status(400).json({ error: error.message }));
    })
        .catch(error => res.status(400).json({ error: error.message }));
};

exports.setPreferredCar = (req, res) => {
    const user = req.auth.user;
    const carId = req.query.id;

    if (!carId) {
        return res.status(400).json({ error: 'Car ID is required' });
    }

    const car = user.cars.find((car) => car._id.toString() === carId);
    if (!car) {
        return res.status(403).json({ message: 'Car is not yours' });
    }

    user.preferences.selected_car = car;

    user.save().then((userRes) => res.status(200).json({
        message: 'Preferred user car set successfully',
        user: userRes,
    })).catch(error => res.status(400).json({ error: error.message }));

}


