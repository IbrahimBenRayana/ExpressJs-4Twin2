const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    //required: true
  },
  password: {
    type: String,
    //required: true
  }
});

userSchema.pre('save', function(next) {
    const user = this;
  
    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) {
      return next();
    }
  
    // Ensure that the password is present and not empty
    if (!user.password || user.password.length === 0) {
      return next(new Error('Password is required'));
    }
  
    // Generate a salt and hash the password
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      }
  
      bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) {
          return next(err);
        }
  
        // Override the cleartext password with the hashed one
        user.password = hash;
        next();
      });
    });
  });

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;