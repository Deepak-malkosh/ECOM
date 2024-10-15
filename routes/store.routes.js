const express = require('express');
const store_route = express.Router();

const bodyParser = require('body-parser');
store_route.use(bodyParser.json());
store_route.use(bodyParser.urlencoded({extended:true}));

const multer = require('multer');
const path = require('path');


store_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/storeImages'));
    },
    filename:function(req,file,cb){
        const name = Date.now() + '-' + file.originalname; 
        cb(null, name, function(error1, success1){
            if(error1) throw error1;
        })
    }
})


const upload = multer({storage:storage});

const storeController = require('../controller/storeController');
const auth = require('../middleware/auth');

//define routes below
store_route.post('/create-store',auth, upload.single('logo'), storeController.createStore);
store_route.post('/find_nearest_store', auth, storeController.nearest_store);



module.exports = store_route;