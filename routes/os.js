var express = require('express');
var router = express.Router();
var os = require('os');

var p = require('../products.json');

router.get('/test', function(req, res){

    res.json(p);
});

router.get('/', function(req, res){

res.json({
    "HostName" : os.hostname(),
    "Type" : os.type(),
    "Platform" : os.platform()
});


});


router.get('/cpus', function(req, res){
    res.json(os.cpus());
})

router.get('/cpus/:id', function(req, res){
   var ident = req.params.id;
    res.json(os.cpus()[ident]);//T[]
})

module.exports = router;