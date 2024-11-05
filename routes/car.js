const express = require('express');
const router = express.Router();

const carCtrl = require('../controllers/car');

router.post('/', carCtrl.addCar);

module.exports = router;