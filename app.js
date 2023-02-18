var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var osRouter = require('./routes/os'); 
const fs = require('fs');
var products = require('./products.json');
// const jsonString = fs.readFileSync("./products.json");
// const Productss = JSON.parse(jsonString);

//convert products into array 
const prods = Object.values(products);



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
//app.use('/os', osRouter);
//app.use('/products',products) ; 


// Route pour afficher la liste des produits
app.get('/products', function(req, res) {
  res.json(products);
  console.log(products);
});

// // Route pour afficher un produit selon son id
// app.get('/products/:id', function(req, res) {
//   const id = req.params.id;
//   const product = prods.find(p => p.id === id);
//   res.json(product);
// });



// Afficher un prouduit selon le nom 
app.get('/products/:name', function(req, res) {
  const name = req.params.name; 
  const product = prods.find(p => p.name === name);
  res.json(product);
});

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




module.exports = app;
