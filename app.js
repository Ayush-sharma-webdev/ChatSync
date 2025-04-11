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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join( __dirname , 'public')));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.use('/' , indexRouter);

app.use('/users' , userRouter);

module.exports = app;