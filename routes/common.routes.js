const express = require('express');
const common_route = express.Router();


const bodyParser = require('body-parser');
common_route.use(bodyParser.json());
common_route.use(bodyParser.urlencoded({extended:true}));

const auth = require('../middleware/auth');

const commonContoller = require('../controller/commonController');

common_route.get('/data_count', auth, commonContoller.data_count);



module.exports = common_route;
