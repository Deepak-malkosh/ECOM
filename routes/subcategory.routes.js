const express = require('express');
const subcat_route = express();

const bodyParser = require('body-parser');
subcat_route.use(bodyParser.json());
subcat_route.use(bodyParser.urlencoded({extended:true}));

const auth = require('../middleware/auth');

const subCategory_controller = require('../controller/subCategoryController');

subcat_route.post('/add-subCategory',auth,subCategory_controller.createSubCategory);



module.exports = subcat_route;