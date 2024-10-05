const path = require('path');
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const usersRouter = require('./routes/user.rutes');
const vehicleRoutes = require('./routes/vehicle.routes');

const indexRouter = require('./routes/index');
require('./bin/db.connection');

const app = express();

require('dotenv').config();

app.set('views', path.join(__dirname, 'common/views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, content-type, Accept, *',
  );
  next();
});

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/vehicle', vehicleRoutes);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = process.env.APP === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
