const express = require('express');
const router = express.Router();

const checkCarExists = require('../middleware/get_auth_preferred_car');

const progCtrl = require('../controllers/prog');
const GetAuthPreferredCar = require("../middleware/get_auth_preferred_car");
const {chargeProg} = require("../models/prog");

router.post('/',checkCarExists, progCtrl.addChargeProg);
router.patch('/toggle_activation',GetAuthPreferredCar, progCtrl.toggleProgActivation);
router.get('/',GetAuthPreferredCar, progCtrl.getAllProg(chargeProg.modelName));
router.get('/active',GetAuthPreferredCar, progCtrl.getAllProg(chargeProg.modelName, true));


module.exports = router;