const express = require('express');
// const { router } = require('../app');

const authController = require('./../controller/authController');


const route = express.Router();

route.post('/signup', authController.signup);
route.post('/login', authController.login);



module.exports = route;