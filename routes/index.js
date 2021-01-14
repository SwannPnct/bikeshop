var express = require('express');
var router = express.Router();

const dataBike = [
  {
    name: "BIK045",
    img: "./images/bike-1.jpg",
    price: 679,
  },
  {
    name: "ZOOK07",
    img: "./images/bike-2.jpg",
    price: 999,
  },
  {
    name: "TITANS",
    img: "./images/bike-3.jpg",
    price: 799,
  },
  {
    name: "CEWO",
    img: "./images/bike-4.jpg",
    price: 1300,
  },
  {
    name: "AMIG39",
    img: "./images/bike-5.jpg",
    price: 479,
  },
  {
    name: "LIK099",
    img: "./images/bike-6.jpg",
    price: 869,
  },
]



/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { 
    bikes : dataBike
   });
});




router.get('/shop', function(req,res,next) {

  if (!req.session.dataCardBike) {
    req.session.dataCardBike = [];
  }
  
  for (let l = 0 ; l < req.session.dataCardBike.length ; l++) {
    if (req.session.dataCardBike[l].name == req.query.name) {
      req.session.dataCardBike[l].quantity++;
      res.render('shop', {
        basket: req.session.dataCardBike
      });
      return;
    }
  }

  req.session.dataCardBike.push({
    name: req.query.name,
    img : req.query.img,
    price : req.query.price,
    quantity : 1,
  });
  res.render('shop', {
    basket: req.session.dataCardBike
  });
})

router.get('/delete-shop', function(req,res,next) {
  for (let k = 0; k < req.session.dataCardBike.length ; k++) {
    if (req.session.dataCardBike[k].name == req.query.name) {
      req.session.dataCardBike.splice(k,1);
    }
  }
  res.render('shop', {
    basket: req.session.dataCardBike
  });
})

router.post('/update-shop', function(req,res,next) {
  for (let k = 0; k < req.session.dataCardBike.length ; k++) {
    if (req.session.dataCardBike[k].name == req.body.name) {
      req.session.dataCardBike[k].quantity = req.body.quantity;
    }
  }
  res.render('shop', {
    basket: req.session.dataCardBike
  });
})

module.exports = router;
