const express = require('express');
const router = express.Router();

const carCtrl = require('../controllers/car');

router.post('/', carCtrl.addCar);
router.get('/:id', carCtrl.getCar);
router.get('/', carCtrl.getAllCars);

module.exports = router;