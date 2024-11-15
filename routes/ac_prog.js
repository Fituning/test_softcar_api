const express = require('express');
const router = express.Router();

const checkCarExists = require('../middleware/check_car_exists');

const ACProgCtrl = require('../controllers/prog');

router.post('/',checkCarExists, ACProgCtrl.addACProg);


module.exports = router;