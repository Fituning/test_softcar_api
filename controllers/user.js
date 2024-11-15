require('dotenv').config();
const User = require('../models/user');
const Car = require('../models/car');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

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
                .then(user => res.status(200).json({
                    message: 'User saved successfully',
                    userId: user._id,
                    token: jwt.sign(
                        { userId: user._id },
                        process.env.JWT_SECRET,
                        { expiresIn: '24h' }
                    )
                }))
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
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.JWT_SECRET,
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error: error.message }));
        })
        .catch(error => res.status(500).json({ error: error.message }));
};

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
                        User.findById(req.auth.userId).then((loggedUser) => {
                            if (!loggedUser) {
                                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
                            }
                            loggedUser.cars.push(car);
                            loggedUser.save()
                                .then(() => res.status(200).json({
                                    message: 'Added car to user succesfully',
                                    user: loggedUser,
                                }))
                                .catch(error => res.status(400).json({ error: error.message }));
                        })
                    }else{
                        if(user._id.toString() === req.auth.userId){
                            return res.status(422).json({ error : "You already owned this vehicle"});
                        }else{
                            return res.status(401).json({ error : "this Vehicle is already owned by another user"});
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

        // Trouver la voiture avec le VIN correspondant dans la liste de voitures
        const carIndex = user.cars.findIndex(car => car.vin === req.body.vin);
        if (carIndex === -1) {
            return res.status(404).json({ error: "Car not found in user's list" });
        }

        // Supprimer la voiture de la liste
        user.cars.splice(carIndex, 1);

        // Enregistrer les modifications de l'utilisateur
        user.save()
            .then(() => res.status(200).json({ message: "Car removed successfully" }))
            .catch(error => res.status(400).json({ error: error.message }));
    })
        .catch(error => res.status(400).json({ error: error.message }));
};


