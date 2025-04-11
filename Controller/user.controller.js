const userModel = require('../Models/user.model');
const userService = require('../Service/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../Models/blacklisttoken.model');

module.exports.showRegisterPage = (req, res , next ) => {
    res.render('register', { error: null });
};

module.exports.showChatPage = (req , res , next)=>{
    res.render('chat');
};

module.exports.registerUser = async (req, res, next) => {
    
    const error = validationResult(req);
    if (!error.isEmpty()) {    
        return res.render('register', { error: error.array() });
    }

    const { fullname, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email });

    if (isUserAlreadyExists) {
        console.log("User already exists");
        return res.render('register', { error: [{ msg: 'User Already Exists.' }] });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        fullname,
        email,
        password: hashedPassword
    });

    const token = user.generateAuthToken();

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000
    });

    res.redirect('/users/chat'); 
};

module.exports.showLoginPage = (req, res) => {
    res.render('login', { error: null });
};

module.exports.loginUser = async (req, res , next) => {
    const error = validationResult(req);

    if (!error.isEmpty()) {
        return res.render('login', { error: error.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');

    if (!user) {
        return res.render('login', { error: [{ msg: 'Invalid Email or Password.' }] });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
        return res.render('login', { error: [{ msg: 'Invalid Credentials.' }] });
    }

    const token = user.generateAuthToken();

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000
    });

    res.redirect('/users/chat');
};

module.exports.showIndexPage = (req , res , next)=>{
    res.render('index')
};

module.exports.logoutUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

        if (token) {
            await blackListTokenModel.create({ token });
        }

        res.clearCookie('token');

        return res.redirect('/users/login');

    } catch (error) {
        return res.render('error', { message: 'Logout failed. Try again.', error: error.message });
    };
};

