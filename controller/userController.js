
const User = require('../models/userModel');
const bcryptjs = require('bcryptjs');
const config = require('../config/config');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const nodemailer = require('nodemailer');
const randomstring = require('randomstring');


const sendResetPasswordMail = async (name, email, token) =>{

    try {
        console.log(1);
        const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:config.emilUser,
                pass:config.emailPassword
            }
        });

        const mailOptions = {
            from:config.emilUser,
            to:email,
            subject:'For Reset Password',
            html:'<p> Hii '+name+', Please copy the link and <a href = "http://172.16.24.216:3001/api/reset-password?token='+token+'">  reset your password</a>' 

        }

        transporter.sendMail(mailOptions, function(err, info){
            if(err){
                console.log(err);
            }
            else{
                console.log("Mail has been sent :- ",info.response);
            }
        })
        
    } catch (error) {
        res.status(400).send({success:false, msg: error.message});
    }
}


const createToken = async (_id) =>{

    try {
        const token = await jwt.sign({ _id: _id }, config.secret_jwt);  
        return token;

    } catch (error) {
        res.status(400).send(message.error);
    }
}


const securePassword = async (password) =>{

    try {
        
        const passwordHash = await bcryptjs.hash(password,10);
        return passwordHash;

    } catch (error) {
        res.status(400).send(error.message)
    }
}


const registerUser = async (req, res) =>{

try {

    const securePass = await securePassword(req.body.password);

    const newUser = new User({
        name:req.body.name,
        email:req.body.email,
        password:securePass,
        image:req.file.filename,
        mobile:req.body.mobile,
        type:req.body.type
    })

    const userData = await User.findOne({email:req.body.email});

    if(userData){
        res.status(200).send({success:false, msg:"This email is already exist"});
    }
    else{
        const user_data = await newUser.save();
        res.status(200).send({success:true, data:user_data})
    }
    
} catch (error) {
    res.status(400).send(error.message);
}

}


const loginUser = async (req, res) =>{

    try {

            const email = req.body.email;
            const password = req.body.password;

            const userData = await User.findOne({email:email});
            if(userData){

                const passwordMatch = await bcryptjs.compare(password, userData.password);
                if(passwordMatch){

                    const tokenData = await createToken(userData._id);

                    const userResult = {
                        _id:userData._id,
                        name:userData.name,
                        email:userData.email,
                        password:userData.password,
                        image:userData.image,
                        mobile:userData.mobile,
                        type:userData.type,
                        token:tokenData
                    }

                    const response = {
                        success:true,
                        msg:"user Details",
                        data : userResult
                    }

                    res.status(200).send(response)

                }else{
                    res.status(200).send({success:false,msg:"Login details i.e. password are incorrect"});

                }

            }else{
                res.status(200).send({success:false,msg:"Login details are incorrect"});
            }
        
    } catch (error) {
        res.status(400).send(error.message );
    }
}


const updatePassword = async (req, res) =>{

    try {
        
        const user_id = req.body.user_id;
        const password = req.body.password;

        const userData = await User.findOne({_id:user_id}); 

        if(userData){

            const newPassword = await securePassword(password);

            const updatedUserData = await User.findByIdAndUpdate({_id:user_id},{$set:{password:newPassword}});

            res.status(200).send({success:true,msg:"Your password has been changed"});

        }else{
            res.status(200).send({success:false,msg:"user Id not found"});
        }


    } catch (error) {
        res.status(400).send(error.message);
    }
}


const forgetPassword = async (req, res) =>{

    try {

        const email = req.body.email
        const userData = await User.findOne({email:email});

        if(userData){

            const randomString = await randomstring.generate();
            const data = await User.updateOne({email:email},{$set:{token:randomString}});

            sendResetPasswordMail(userData.name, userData.email, randomString);

            res.status(200).send({success:true, msg:"Please check your inbox of mail and reset your password"})


        }else{
            res.status(200).send({success:true,msg:"This mail is not exist"});

        }
        
    } catch (error) {
        res.status(400).send({success:false, msg:error.message});
    }
}


const resetPassword = async (req, res) =>{

    try {

        const token = req.query.token;
        const tokenData = await User.findOne({token : token});

        if(tokenData){

            const password = req.body.password;
            const newPassword = await securePassword(password);

            const userData = await User.findByIdAndUpdate({_id:tokenData._id},{$set:{password:newPassword, token:''}},{new:true})

            res.status(200).send({success:true, msg:"User password has been reset", data:userData});
        }
        else{
            res.status(400).send({success:true, msg:"This link has been expired"});
        }
        
    } catch (error) {
        res.status(400).send({success:false, msg:error.message});

    }
}


const renewToken = async (id) =>{

    try {

        const old_secret_jwt = config.secret_jwt;
        const new_secret_jwt = randomstring.generate();

        fs.readFile('config/config.js','utf-8',function(err, data){
            if(err) throw err;

            // this below line replace old secret key to new secrete key and here "g" means global
            var replaceSecretKey = data.replace(new RegExp(old_secret_jwt,"g"), new_secret_jwt)

            fs.writeFile('config/config.js',replaceSecretKey, 'utf-8', function(err, data){
                if(err) throw err;

                console.log("data-->",data)
            })
        })
        
        const token = await jwt.sign({ _id: id }, new_secret_jwt);  
        return token;

    } catch (error) {
        res.status(400).send({success:false, msg:error.message});

    }
}


const refreshToken = async (req, res) =>{

    try {
        
        const user_id = req.body.user_id;

        const userData = await User.findOne({_id:user_id});
        if(userData){

            const tokenData = await renewToken(user_id);
            const response = {
                user_id:user_id,
                token:tokenData
            }

            res.status(200).send({success:true, msg:"Refresh token details", data:response})

        }
        else{
            res.status(200).send({success:false, msg:"user not found"});
        }

    } catch (error) {
        res.status(400).send({success:false, msg:error.message});

    }
}



module.exports = {
    registerUser,loginUser, updatePassword, forgetPassword, resetPassword, refreshToken
}