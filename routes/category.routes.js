const express = require('express');
const category_route = express.Router();


const bodyParser = require('body-parser');
category_route.use(bodyParser.json());
category_route.use(bodyParser.urlencoded({extended:true}));


const categoryController = require('../controller/categoryController');

const auth = require('../middleware/auth');

category_route.post('/add-category', auth, categoryController.addCategory);



module.exports = category_route;