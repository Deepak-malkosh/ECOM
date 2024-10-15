const Store = require('../models/storeModel');
const User = require('../models/userModel');


const createStore = async (req, res) =>{

    try {

        const userData = await User.findOne({_id:req.body.vendor_id});

        if(userData){

            if(!req.body.latitude || !req.body.longitude){

                    res.status(200).send({success:false, msg:"latitude & longitude are not found"});
            }else{


                const vendorData = await Store.findOne({vendor_id:req.body.vendor_id});

                if(vendorData){
                    res.status(200).send({success:false, msg:"This vendor is already exist"});
                }else{

                    const newStore = new Store({

                        vendor_id:req.body.vendor_id,
                        logo:req.file.filename,
                        business_email:req.body.business_email,
                        address:req.body.address,
                        pin:req.body.pin,
                        location:{
                            type:"Point",
                            coordinates:[parseFloat(req.body.latitude), parseFloat(req.body.longitude)]
                        }
                    });


                    const storeData = await newStore.save();
                    res.status(200).send({success:true,msg:"store data", data:storeData});

                }
            }

        }else{
            res.status(200).send({success:false,msg:"vendor_id doesn't exist"});
        }
        
    } catch (error) {
        res.status(400).send({success:false, msg: error.message});
    }
}


const get_store = async (id) =>{

    try {
        
        return await Store.findOne({_id:id});

    } catch (error) {
        res.status(400).send({success:false, msg: error.message});

    }
}


const nearest_store = async (req, res) =>{

    try {

        const latitude = req.body.latitude;
        const longitude = req.body.longitude;

        const store_data = await Store.aggregate([
            {
                $geoNear:{
                    near:{type:"Point", coordinates:[parseFloat(longitude), parseFloat(latitude)]},
                    key:'location',
                    maxDistance:parseFloat(1000)*1609,
                    distanceField:"dist.calculated",
                    spherical:true
                }
            }
        ]);

        res.status(200).send({success:true, msg:"Store Details", data:store_data})

    } catch (error) {
        res.status(400).send({success:false, msg: error.message});
        
    }

}





module.exports = {
    createStore,
    get_store,
    nearest_store
}