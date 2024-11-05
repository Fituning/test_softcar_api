const Car = require('../models/car');

exports.addCar = (req, res) => {
    const car = new Car({
        vin: req.body.vin,
        color: req.body.color,
    });

    car.save().then(
        () => {
            res.status(201).json({
                message: 'Car added successfully!'
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