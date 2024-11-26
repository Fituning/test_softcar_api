const express = require('express');
const router = express.Router();

const GetAuthPreferredCar = require('../middleware/get_auth_preferred_car');
const Auth = require('../middleware/auth');

const carCtrl = require('../controllers/car');

router.post('/', carCtrl.addCar);
router.get('/cars',Auth, carCtrl.getAllCars);
router.delete('/cars', carCtrl.deleteAllCars);
// router.get('/:id', GetAuthPreferredCar, carCtrl.getCar); //depreciated
router.get('/', GetAuthPreferredCar, carCtrl.getCar);
// Mise à jour des statuts individuels
// router.patch('/:id/lock', GetAuthPreferredCar, carCtrl.updateLockStatus);
// router.patch('/:id/update/air_conditioning', GetAuthPreferredCar, carCtrl.updateCarAirConditioning);
// router.patch('/:id/update/battery', GetAuthPreferredCar, carCtrl.updateBattery);
router.patch('/lock', GetAuthPreferredCar, carCtrl.updateLockStatus);
router.patch('/update/air_conditioning', GetAuthPreferredCar, carCtrl.updateCarAirConditioning);
router.patch('/update/battery', GetAuthPreferredCar, carCtrl.updateBattery);
// router.patch('/:id/ac', carCtrl.updateACStatus);
// router.patch('/:id/gps', carCtrl.updateGPSLocation);
// router.patch('/:id/ventilation', carCtrl.updateVentilationLevel);
// router.patch('/:id/charge', carCtrl.updateChargeStatus);


module.exports = router;
