var express = require('express');
var path = require('path');
var logger = require('morgan');
var http = require('http');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo = require("./routes/mongo");
var index = require('./routes/index');
var users = require('./routes/users');
var methodOverride = require('method-override');

var mongoSessionConnectURL = "mongodb://nandan123:nandan123@ds145121.mlab.com:45121/nandandb";

var app = express();

// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//all requests
app.get('/', index.displayIndex);
app.get('/getAllData', index.getAllData);
app.post('/findData', index.findData);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

//connect to the mongo collection session and then createServer
mongo.connect(mongoSessionConnectURL, function(){
	console.log('Connected to mongo at: ' + mongoSessionConnectURL);
	http.createServer(app).listen(app.get('port'), function(){
		console.log('Express server listening on port ' + app.get('port'));
	});  
});

module.exports = app;