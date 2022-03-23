const express = require('express');
// const { router } = require('../app');

const authController = require('./../controller/authController');


const route = express.Router();

route.post('/signup', authController.signup);
route.post('/login', authController.login);
route.post('/forgotPassword', authController.forgotPassword);
route.post('/resetPassword/:id', authController.resetPassword);



module.exports = route;