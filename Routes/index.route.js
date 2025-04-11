const express = require('express');
const router = express.Router();
const userController = require('../Controller/user.controller');

router.get('/' , userController.showIndexPage);

module.exports = router;