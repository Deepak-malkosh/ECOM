const jwt = require('jsonwebtoken');
const config = require("../config/config");


const verifiedToken = async (req, res, next) =>{

try {

    const token = req.body.token || req.query.token || req.headers["token"];

    if(!token){

       return res.status(200).send({success:false,msg:"A token is required for authentication"});
    }

    const descode = jwt.verify(token, config.secret_jwt);
    req.user = descode;

    next();
    
} catch (error) {
    res.status(400).send("Invalid Token");
}

}



module.exports = verifiedToken;