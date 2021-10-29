const express = require('express');
const Razorpay = require('razorpay');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config()

app.use(express.static("public"));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
  }));

const razorpay = new Razorpay({
    key_id: process.env.KEY_ID,
    key_secret: process.env.KEY_SECRET
})
//
// app.get('/',(req,res)=>{
//     res.render('home');
// })

app.get('/',(req,res)=>{
    res.sendFile(__dirname+"/public/home.html");
})

app.get('/donation',(req,res)=>{
  // res.sendFile(__dirname+"/public/donation.html")
  res.render('donation')
})

app.post('/order',(req,res) => {
  var options = {
  amount: 100,  // amount in the smallest currency unit
  currency: "INR",
    };
    razorpay.orders.create(options, (err,order)=>{
      // console.log(order);
      res.json(order);
    })
})


app.post('/is-order-complete',(req,res)=>{
  razorpay.payment.fetch(req.body.razorpay_payment_id).then((pay)=>{
    if(pay==='captured'){
      res.sendFile(__dirname+"/public/thankyou.html")
    }else {
      res.sendFile(__dirname+"/public/failure.html")
    }
  })
})


app.listen(process.env.PORT || 3000, function() {
    console.log("Server up and running at port 3000.");
  })
