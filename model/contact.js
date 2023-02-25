var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Contact = new Schema({

    name : String,
    phone : Number,
    email : String
    
});

module.exports = mongoose.model('contacts', Contact);