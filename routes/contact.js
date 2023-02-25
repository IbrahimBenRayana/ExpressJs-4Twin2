var express = require('express');
var router = express.Router();
var Contact = require('../model/contact');

router.get('/', function(req, res){

Contact.find(function(err, data){
    if(err) throw err;

    res.json(data);
});

    
});
module.exports = router;