const BuyProduct = require('../models/buyProductModel');

const buy_product = async(req, res) =>{

    try {

        const buyProduct = new BuyProduct({

            product_id:req.body.product_id,
            transection_id:req.body.transection_id,
            vendor_id:req.body.vendor_id,
            store_id:req.body.store_id,
            customer_id:req.body.customer_id,
        });

        const buyProdData = await buyProduct.save();

        res.status(200).send({success:true, msg:'Buy Product Details', data:buyProdData});
        
    } catch (error) {
        res.status(400).send({success:false, msg: error.message});
    }
}


module.exports = {buy_product}