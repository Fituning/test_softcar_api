const express = require('express');
const router = express.Router();

const checkCarExists = require('../middleware/get_auth_preferred_car');

const ACProgCtrl = require('../controllers/prog');

router.post('/',checkCarExists, ACProgCtrl.addACProg);


module.exports = router;
