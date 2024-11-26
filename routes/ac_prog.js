const express = require('express');
const router = express.Router();

const GetAuthPreferredCar = require('../middleware/get_auth_preferred_car');

const ACProgCtrl = require('../controllers/prog');

router.post('/',GetAuthPreferredCar, ACProgCtrl.addACProg);


module.exports = router;
