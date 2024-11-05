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
