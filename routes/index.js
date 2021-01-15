var express = require('express');
var router = express.Router();

const Stripe = require('stripe');
const stripe = Stripe('sk_test_51I9p5tCWsKpkke60jeeBZZWPfnK7ZnX08JdmywNX93L9Xk9P0OrFDzx2urskDj7MgA9rPU600wc7xaZlixUrtGUi00nhfUE0LA');



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
  
    req.session.dataCardBike.splice(req.query.index,1);
    res.render('shop', {
    basket: req.session.dataCardBike
  });
})

router.post('/update-shop', function(req,res,next) {

  if (req.body.quantity == 0) {
    req.session.dataCardBike.splice(req.body.index,1);
    res.render('shop', {
      basket: req.session.dataCardBike
    })
  } else {
    req.session.dataCardBike[req.body.index].quantity = req.body.quantity;

    res.render('shop', {
    basket: req.session.dataCardBike
  });
  }

  
})

router.get("/success", function(req,res,next) {
  res.render("success", {
    
  });
})

router.post('/create-checkout-session', async (req, res) => {

  const stripe_basket = [];
  for (let i =0 ; i<req.session.dataCardBike.length; i++) {
    stripe_basket.push({
      price_data: {
        currency: 'eur',
        product_data: {
          name: req.session.dataCardBike[i].name,
        },
        unit_amount: req.session.dataCardBike[i].price * 100,
      },
      quantity: req.session.dataCardBike[i].quantity,
    })
  }
    
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: stripe_basket,
    mode: 'payment',
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/',
  });

  res.json({ id: session.id });
});

module.exports = router;
