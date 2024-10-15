// const express = require('express');
// const userRoute = express.Router();

// const userController = require('../controller/userController');

// userRoute.get('/get',userController.getUser);


// module.exports = userRoute;


const express  = require('express');
const user_route = express.Router();

const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}));

const auth = require('../middleware/auth');

const multer = require('multer');
const path = require('path');

user_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/userImages'));
    },
    filename:function(req,file,cb){
        const name = Date.now() + '-' + file.originalname; 
        cb(null, name, function(error1, success1){
            if(error1) throw error1;
        })
    }
})

const upload = multer({storage:storage});

const userController = require('../controller/userController');

user_route.post('/register',upload.single('image'),userController.registerUser);
user_route.post('/login',userController.loginUser);
user_route.get('/test',auth, function(req, res){

    res.status(200).send(" request is authenticated");
});
user_route.post('/update-password',auth,userController.updatePassword);
user_route.post('/forget-password',userController.forgetPassword);
user_route.post('/reset-password',userController.resetPassword);
user_route.post('/refresh-token',auth, userController.refreshToken)







module.exports = user_route;