const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const userController = require('../Controller/user.controller');
const authMiddleware = require('../Middlewares/auth.middleware');

router.get('/register' , userController.showRegisterPage);
router.get('/login' , userController.showLoginPage);

router.get('/chat' , authMiddleware.authUser ,  userController.showChatPage)

router.post('/register', [
    body('fullname').isLength({ min: 3 }).withMessage('Full name should contain 3 or more characters'),
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 4 }).withMessage('Password should contain 4 or more characters')
], userController.registerUser);

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 4 }).withMessage('Password should contain 4 or more characters')
], userController.loginUser);

router.get('/logout' , authMiddleware.authUser , userController.logoutUser);

module.exports = router;