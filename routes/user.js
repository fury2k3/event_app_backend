const express = require('express');
const router = express.Router();
const userController = require('../controllers/user'); 

// Route for user sign-up
router.post('/signup', userController.signUp);

// Route for user login
router.post('/login', userController.login);
router.post('/getQr', userController.sendEmailQr);

// Route for forget password
router.post("/forgotPassword", userController.forgotPassword);
router.post("/verifyResetCode", userController.verifyPasswordResetCode);
router.put("/resetPassword", userController.resetPassword);



module.exports = router;
