const express = require('express');
const buy_product_route = express();

const bodyParser = require('body-parser');
buy_product_route.use(bodyParser.json());
buy_product_route.use(bodyParser.urlencoded({extended:true}));

const auth = require('../middleware/auth');


const buyProductController = require('../controller/buyProductController');

buy_product_route.post('/buy-product', auth, buyProductController.buy_product);



module.exports = buy_product_route;