var express = require('express');
var router = express.Router();
var p = require('../products.json');


router.get('/instock/:qt', function(req, res, next) {
    
   var qte = req.params.qt;
   var filtredProds = {};

   Object.keys(p).forEach(function(key){

    var prod = p[key]
    if(prod.stock>=qte){
        filtredProds[key] = prod
    }
   });
   res.json(filtredProds);
   });


router.get('/:id/:qt', function(req, res, next) {
    
        res.json({
            "id" : req.params.id,
            "Quantité" : req.params.qt,
            "unit_price" : p[req.params.id].price,
            "total_price" : p[req.params.id].price * req.params.qt

        });


    
   });

router.get('/', function(req, res, next) {
 res.json(p);
});

router.get('/:id', function(req, res, next) {
    
    res.json(p[req.params.id]);
   });



module.exports = router;