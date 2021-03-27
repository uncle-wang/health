var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/admin', express.static(path.resolve(__dirname, './../frontend_admin/dist')));
app.use('/freepack', express.static(path.resolve(__dirname, './../frontend/dist')));

app.use('/api', indexRouter);

module.exports = app;
