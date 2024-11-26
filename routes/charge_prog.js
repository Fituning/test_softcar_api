const express = require('express');
const router = express.Router();

const checkCarExists = require('../middleware/get_auth_preferred_car');

const progCtrl = require('../controllers/prog');

router.post('/',checkCarExists, progCtrl.addChargeProg);


module.exports = router;