const dotenv = require('dotenv');
dotenv.config();
const connectTOdb = require('./DB/DB');
connectTOdb();
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const indexRouter = require('./Routes/index.route');
const userRouter = require('./Routes/user.route');

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));
app.set('view engine' , 'ejs');
app.use(express.static(path.join( __dirname , 'public')));

app.use('/' , indexRouter);

app.use('/users' , userRouter);

module.exports = app;