const Address = require('../models/addressModel');


const add_address = async (req, res) =>{

    try {

        const data = await Address.findOne({user_id:req.body.user_id});

        if(data){

            var addressArray = [];

            for(let i=0; i<data.address.length; i++){
                addressArray.push(data.address[i]);
            }
            addressArray.push(req.body.address);

            const updated_data = await Address.findOneAndUpdate(
                {user_id:req.body.user_id},
                {$set:{address:addressArray}},
                {returnDocument:'after'}
            );

            res.status(200).send({success:true, msg: "Address Details", data:updated_data});

        }else{

            const address = new Address({
                user_id:req.body.user_id,
                address:req.body.address
            });
    
            const address_data = await address.save();
            res.status(200).send({success:true, msg: "Address Details", data:address_data});

        }

        
    } catch (error) {
        res.status(400).send({success:false, msg:error.message});
    }
}


module.exports = {add_address}