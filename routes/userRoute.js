const express = require('express');
// const { router } = require('../app');

const authController = require('./../controller/authController');
const userController = require('./../controller/userController')



const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword/:id', authController.resetPassword);
router.patch('/updatePassword', authController.protect, authController.updatePassword);


router.route('/:id').get(authController.protect, authController.restrictTo('admin'), userController.getUser);
router.route('/').get(authController.protect, authController.restrictTo('admin'), userController.getAllUsers);

router.route('/me/about').get(authController.protect, userController.getMe)

module.exports = router;