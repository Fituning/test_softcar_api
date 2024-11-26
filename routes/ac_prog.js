const express = require('express');
const router = express.Router();

const GetAuthPreferredCar = require('../middleware/get_auth_preferred_car');

const ACProgCtrl = require('../controllers/prog');

router.post('/',GetAuthPreferredCar, ACProgCtrl.addACProg);
router.patch('/toggle_activation',GetAuthPreferredCar, ACProgCtrl.toggleProgActivation);


module.exports = router;
