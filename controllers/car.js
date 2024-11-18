const Car = require('../models/car');

const { DoorState } = require('../enums/car_enum');
const {RoleLevels, UserRole} = require("../enums/user_enum");
const mqttClient = require('../mqtt'); // Importe le client MQTT

exports.addCar = (req, res) => {
    const car = new Car({
        vin: req.body.vin,
        color: req.body.color,
    });

    car.save().then(
        () => {
            res.status(201).json({
                message: 'Car added successfully!',
                carVin:car.vin,
                carId:car._id
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
}


exports.getCar = (req, res) => {
    res.status(200).json(req.car);
};


exports.getAllCars = (req, res) => {
    const user = req.auth.user;

    if (RoleLevels[user.role]  >= RoleLevels[UserRole.ADMIN]) {

        Car.find().then(
            cars => {
                res.status(200).json(
                    {
                        "message": "Request successful",
                        "timestamp": new Date().toLocaleString(undefined, { timeZoneName: 'short' }), // Correct
                        "count": cars.length,
                        "data_type" : cars[0].type,
                        "data": {cars},  // Les données que vous souhaitez transmettre
                        "errors": null,  // Une liste d'erreurs s'il y en a
                    }
                );
            }
        ).catch(error => {
            res.status(400).json({error: error});
        })
    }else {
        user.populate('cars').then( user => {
            res.status(200).json(user.cars);
            }
        ).catch(error => {
            res.status(400).json({error: error});
        })
    }
}

exports.deleteAllCars = (req, res) => {
    Car.deleteMany().then(
        (cars) => {
            res.status(200).json({massage : "deleted all " + cars.deletedCount +" cars"});
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            })
        }
    )
}

exports.updateLockStatus = (req, res) => {
    const { right_door, left_door, hood } = req.body;

    // Vérifie que les valeurs des portes sont valides selon l'énumération DoorState
    if (right_door && !Object.values(DoorState).includes(right_door)) {
        return res.status(400).json({ error: `Invalid right_door state. Use ${Object.values(DoorState).join(" or ")}.` });
    }
    if (left_door && !Object.values(DoorState).includes(left_door)) {
        return res.status(400).json({ error: `Invalid left_door state. Use ${Object.values(DoorState).join(" or ")}.` });
    }
    if (hood && !Object.values(DoorState).includes(hood)) {
        return res.status(400).json({ error: `Invalid hood state. Use ${Object.values(DoorState).join(" or ")}.` });
    }

    // Met à jour les statuts des portes uniquement si des valeurs valides sont fournies
    if (right_door) req.car.right_door = right_door;
    if (left_door) req.car.left_door = left_door;
    if (hood) req.car.hood = hood;

    req.car.save().then(
        (car) => {
            res.status(200).json({
                right_door: req.car.right_door,
                left_door: req.car.left_door,
                hood: req.car.hood
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({ error });
        }
    );
};

exports.updateCarAirConditioning = (req, res) => {
    const updates = req.body; // Obtenez toutes les valeurs de mise à jour depuis le corps de la requête

    // Mettez à jour uniquement les champs fournis dans le corps de la requête
    for (let key in updates) {
        if (updates.hasOwnProperty(key)) {
            req.car.air_conditioning[key] = updates[key];
        }
    }

    req.car.save().then(
        (car) => {
            res.status(200).json(car);
            const message = JSON.stringify({ air_conditioning: car.air_conditioning });
            mqttClient.publish('car/airConditioning', message, { qos: 1 }, (error) => {
                if (error) {
                    console.error('Erreur lors de l\'envoi du message MQTT :', error);
                } else {
                    console.log('Message MQTT envoyé :', message);
                }
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({ error });
        }
    );
};

exports.updateBattery = (req, res) => {
    const updates = req.body; // Obtenez toutes les valeurs de mise à jour depuis le corps de la requête

    // Mettez à jour uniquement les champs fournis dans le corps de la requête
    for (let key in updates) {
        if (updates.hasOwnProperty(key)) {
            req.car.battery[key] = updates[key];
        }
    }

    req.car.save().then(
        (car) => {
            // Publier un message MQTT après la mise à jour de la batterie
            const message = JSON.stringify({ battery: car.battery });
            mqttClient.publish('car/batteryStatus', message, { qos: 1 }, (error) => {
                if (error) {
                    console.error('Erreur lors de l\'envoi du message MQTT :', error);
                } else {
                    console.log('Message MQTT envoyé :', message);
                }
            });

            res.status(200).json(car);
        }
    ).catch(
        (error) => {
            res.status(400).json({ error });
        }
    );
};

