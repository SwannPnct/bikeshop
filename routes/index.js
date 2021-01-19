var express = require('express');
var router = express.Router();

const Stripe = require('stripe');
const stripe = Stripe('sk_test_51I9p5tCWsKpkke60jeeBZZWPfnK7ZnX08JdmywNX93L9Xk9P0OrFDzx2urskDj7MgA9rPU600wc7xaZlixUrtGUi00nhfUE0LA');



const dataBike = [
  {
    name: "BIK045",
    img: "/images/bike-1.jpg",
    price: 679,
    mea: true
  },
  {
    name: "ZOOK07",
    img: "/images/bike-2.jpg",
    price: 999,
    mea: false
  },
  {
    name: "TITANS",
    img: "/images/bike-3.jpg",
    price: 799,
    mea: true
  },
  {
    name: "CEWO",
    img: "/images/bike-4.jpg",
    price: 1300,
    mea: false
  },
  {
    name: "AMIG39",
    img: "/images/bike-5.jpg",
    price: 479,
    mea: true
  },
  {
    name: "LIK099",
    img: "./images/bike-6.jpg",
    price: 869,
    mea: false
  }
]

function calculateTaxes(basket) {
  let taxes = 0;
  let total = 0;
  for (let i = 0; i < basket.length; i++) {
    total += basket[i].price * basket[i].quantity;
    taxes += 30 * basket[i].quantity;
  }
  if (total >= 2000 && total < 4000) {
    taxes = taxes/2;
  } else if(total >= 4000) {
    taxes = 0;
  }

  return taxes;
}


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
        basket: req.session.dataCardBike,
        calculatedTaxes: calculateTaxes(req.session.dataCardBike)
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
    basket: req.session.dataCardBike,
    calculatedTaxes: calculateTaxes(req.session.dataCardBike)
  });
})

router.get('/delete-shop', function(req,res,next) {
  
    req.session.dataCardBike.splice(req.query.index,1);
    res.render('shop', {
    basket: req.session.dataCardBike,
    calculatedTaxes: calculateTaxes(req.session.dataCardBike)
  });
})

router.post('/update-shop', function(req,res,next) {

  if (req.body.quantity == 0) {
    req.session.dataCardBike.splice(req.body.index,1);
    res.render('shop', {
      basket: req.session.dataCardBike,
      calculatedTaxes: calculateTaxes(req.session.dataCardBike)
    })
  } else {
    req.session.dataCardBike[req.body.index].quantity = req.body.quantity;

    res.render('shop', {
    basket: req.session.dataCardBike,
    calculatedTaxes: calculateTaxes(req.session.dataCardBike)
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
  stripe_basket.push(
    {
      price_data: {
        currency: 'eur',
        product_data: {
          name: "(TAXES)",
        },
        unit_amount: calculateTaxes(req.session.dataCardBike) * 100,
      },
        quantity: 1,
      })
    
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
