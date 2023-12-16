const express = require('express');
const authController = require('../auth/auth.controller')
const router = express.Router();

router.route('/login').post(authController.login);
router.route('/reset-password/:id').put(authController.resetPassword);


module.exports = router