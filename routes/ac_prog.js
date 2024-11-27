const express = require('express');
const router = express.Router();

const GetAuthPreferredCar = require('../middleware/get_auth_preferred_car');

const progCtrl = require("../controllers/prog");
const {ACProg} = require("../models/prog");

router.post('/',GetAuthPreferredCar, progCtrl.addACProg);
router.patch('/toggle_activation',GetAuthPreferredCar, progCtrl.toggleProgActivation);
router.get('/',GetAuthPreferredCar, progCtrl.getAllProg(ACProg.modelName));
router.get('/active',GetAuthPreferredCar, progCtrl.getAllProg(ACProg.modelName, true));


module.exports = router;
