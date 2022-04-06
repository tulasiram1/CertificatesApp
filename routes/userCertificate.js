const express = require('express');
const handler = require('./../controller/certificateController');
const router = express.Router();
const authController = require('./../controller/authController');

// router.post('/', authController.protect, handler.addCertificate);

router.route('/').delete(authController.protect, authController.restrictTo('admin'), handler.deleteAll).post(authController.protect, handler.addCertificate).get(authController.protect, authController.restrictTo('admin'), handler.getAllCertificates);
router.route('/:id').delete(authController.protect, handler.delete);


module.exports = router;