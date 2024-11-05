const Car = require('../models/car');

const { VentilationLevel, AirConditioningMode, DoorState, SoftwareStatus } = require('../enums/car_enum');

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
    Car.findOne({
        _id: req.params.id
    }).then(
        (thing) => {
            res.status(200).json(thing);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
}

exports.getAllCars = (req, res) => {
    Car.find().then(
        (cars) => {
            res.status(200).json(cars);
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
