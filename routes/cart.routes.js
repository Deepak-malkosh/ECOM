const express = require('express');
const cart_route = express();

const bodyParser = require('body-parser');
cart_route.use(bodyParser.json());
cart_route.use(bodyParser.urlencoded({extended:true}));

const auth = require('../middleware/auth');

const cartController = require('../controller/cartController');

cart_route.post('/add-to-cart', auth, cartController.add_to_cart);



module.exports = cart_route;