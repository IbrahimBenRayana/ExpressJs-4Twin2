var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
var User = require('./model/User');
const Userr = require('./model/User');
const jwt = require('jsonwebtoken');

var name = '';
var password = '';

var mongoose = require('mongoose');
var config = require('./database/mongodb');
mongoose.connect(config.mongo.uri);


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var osRouter = require('./routes/os');
var pRouter = require('./routes/produits');
var cRouter = require('./routes/contact');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/os', osRouter);
app.use('/produit', pRouter);
app.use('/contact', cRouter);

const secretKey = 'Fissiou';

//Signup 
app.post('/signup', (req, res) => {
  const { name, password } = req.body; // extract user data from request body

  // create a new user instance
  const newUser = new User({
    name,
    password
  });

  // save the user to the database
  newUser.save((err) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: 'Error creating user' });
    } else {
      // generate a token and send it back to the client
      const token = jwt.sign({ name, password }, secretKey);
      res.status(200).json({ token }); 
    }
  });
});








//Auth 
app.get('/login', (req, res) => {
  res.send(`
    <form method="post" action="/login">
      <input type="text" name="name" placeholder="Username">
      <input type="password" name="password" placeholder="Password">
      <button type="submit">Login</button>
    </form>
  `);
});

app.post('/login', (req, res, next) => {
  name = req.body.name ; 
  password = req.body.password ;
  var newUser = new User({
    name,
    password
  });
  console.log(newUser);
  passport.authenticate('local', (err, newUser, info) => {
    
    if (err) { return next(err); }
    if (!newUser) { 
      return res.status(401).json({ message: 'Incorrect username or password' }); 
    }
    req.logIn(newUser, (err) => {
      if (err) { return next(err); }
      return res.json({ message: 'Login successful' });
    });
  })(req, res, next);

  const { username } = req.body.name;
  User.findOne({ name: username }, (err, newUser) => {
    if (err) { console.error(err); }
    console.log(req.body.name);
  });
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/dashboard', (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Welcome, ${req.user.username}!`);
  } else {
    res.redirect('/login');
  }
});


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) return done(err);
      if (!user) return done(null, false);
      user.comparePassword(password, function(err, isMatch) {
        if (err) return done(err);
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    });
  }
));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  const user = users.find(u => u.id === id);
  done(null, user);
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
