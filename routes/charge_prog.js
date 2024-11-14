const express = require('express');
const router = express.Router();

const checkCarExists = require('../middleware/check_car_exists');

const progCtrl = require('../controllers/prog');

router.post('/',checkCarExists, progCtrl.addChargeProg);


module.exports = router;