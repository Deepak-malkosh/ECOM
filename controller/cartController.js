const Cart = require('../models/cartModel');

const add_to_cart = async (req, res) =>{

    try {

        const data_addtoCart = new Cart({

            product_id:req.body.product_id,
            price:req.body.price,
            vendor_id:req.body.vendor_id,
            store_id:req.body.store_id
        });

        const save_to_cart = await data_addtoCart.save();

        res.status(200).send({success:true, msg:"", data:save_to_cart});
        
    } catch (error) {
        res.status(400).send({success:false, msg: error.message});
    }
}


module.exports = {add_to_cart,}