const express = require('express');
const router = express.Router();

const checkCarExists = require('../middleware/check_car_exists');

const carCtrl = require('../controllers/car');

router.post('/', carCtrl.addCar);
router.get('/:id', carCtrl.getCar);
router.get('/', carCtrl.getAllCars);

// Mise à jour des statuts individuels
router.patch('/:id/lock', checkCarExists, carCtrl.updateLockStatus);
router.patch('/:id/update/air_conditioning', checkCarExists, carCtrl.updateCarAirConditioning);
// router.patch('/:id/ac', carCtrl.updateACStatus);
// router.patch('/:id/gps', carCtrl.updateGPSLocation);
// router.patch('/:id/ventilation', carCtrl.updateVentilationLevel);
// router.patch('/:id/charge', carCtrl.updateChargeStatus);


module.exports = router;