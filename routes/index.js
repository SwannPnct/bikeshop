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

const dataCardBike = [
  {
    name: "BIK045",
    img: "./images/bike-1.jpg",
    price: 679,
    quantity : 2
  },
  {
    name: "LIK099",
    img: "./images/bike-6.jpg",
    price: 869,
    quantity : 1
  }
];





router.get('/shop', function(req,res,next) {
  res.render('shop', {
    basket: dataCardBike
  })
})

module.exports = router;
