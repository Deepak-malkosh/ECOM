const express = require('express');
const address_route = express();

const bodyParser = require('body-parser');
address_route.use(bodyParser.json());
address_route.use(bodyParser.urlencoded({extended:true}));

const auth = require('../middleware/auth');


const addressController = require('../controller/addressController');

address_route.post('/add-address', auth, addressController.add_address);



module.exports = address_route;