var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const gatewayController = require('./controllers/Gateway.controller.js');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Create a new beacon or gateway
app.post('/beacon', gatewayController.create);
app.post('/gateway', gatewayController.create);

// Retrieve all beacons/gateway
app.get('/beacons', gatewayController.findAll);
app.get('/gateways', gatewayController.findAll);

// Retrieve a single beacon/gateway with  Id
app.get('/beacon', gatewayController.findOne);
app.get('/gateway', gatewayController.findOne);

// Update a beacon with beaconId
app.put('/beacon/:beaconId', gatewayController.update);
app.put('/gateway/:gatewayId', gatewayController.update);

// Delete a beacon with beaconId
app.delete('/beacon/:beaconId', gatewayController.delete);
app.delete('/gateway/:gatewayId', gatewayController.delete);

module.exports = app;
