const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');
const auth = require('../middleware/auth');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/user',auth, userCtrl.getUser);
router.patch('/add_car',auth, userCtrl.addCar);
router.patch('/remove_car',auth, userCtrl.removeCar);
router.patch('/set_pref_car',auth, userCtrl.setPreferredCar);
//router.post('/logout', userCtrl.login);

module.exports = router;