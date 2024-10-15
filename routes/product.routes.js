const express = require('express');
const prod_route = express();

const bodyParser = require('body-parser');
prod_route.use(bodyParser.json());
prod_route.use(bodyParser.urlencoded({extended:true}));


const multer = require('multer');
const path = require('path');


prod_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/productImages'),function(err, success){
            if(err){
                throw err
            }    
        });
    },
    filename:function(req,file,cb){
        const name = Date.now() + '-' + file.originalname; 
        cb(null, name, function(error1, success1){
            if(error1) throw error1;
        })
    }
})


const upload = multer({storage:storage});

const auth = require('../middleware/auth');

const productController = require('../controller/productController');

prod_route.post('/add-product',upload.array('images'), auth, productController.add_product);
prod_route.get('/get-product',auth, productController.get_product);
prod_route.get('/search-product',auth, productController.search_product);

 



module.exports = prod_route;