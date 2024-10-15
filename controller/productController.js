const Product = require('../models/produceModel');
const Category_controller = require('../controller/categoryController');
const Store_controller = require('../controller/storeController');

const add_product = async(req, res) =>{

    try {

        var arrImages = [];

        for(let i=0; i<req.files.length; i++){
            arrImages[i] = req.files[i].filename;
        }

        const new_product = new Product({

            vendor_id:req.body.vendor_id,
            store_id:req.body.store_id,
            name:req.body.name,
            price:req.body.price,
            discount:req.body.discount,
            category_id:req.body.category_id,
            sub_cat_id:req.body.sub_cat_id,
            images:arrImages
        });


        const prod_data = await new_product.save();
        res.status(200).send({success:true, msg:"Product Details", data:prod_data});
        
    } catch (error) {
        res.status(400).send({success:false, msg:error.message});
    }
}


const get_product = async (req, res) =>{

    try {

        var send_data = [];

        const cat_data = await Category_controller.getCategory();
        if(cat_data.length){

            for(let i=0; i<cat_data.length; i++){
                var prod_data = [];
                var cat_id = cat_data[i]['_id'].toString();

                var cat_prod = await Product.find({category_id:cat_id}); 
                if(cat_prod.length > 0){
                    for(let j=0; j<cat_prod.length; j++){
                         var store_data = await Store_controller.get_store(cat_prod[j]['store_id']);

                         prod_data.push({
                            "product_name":cat_prod[j]['name'],
                            "images":cat_prod[j]['images'],
                            "store_address":store_data['address']

                         })

                    }
                }
                send_data.push({
                    "category":cat_data[i]['category'],
                    "product":prod_data
                })
            }
            res.status(200).send({success:true, msg:"Product details", data:send_data});

        }else{
            res.status(200).send({success:false, msg:"Product details", data:send_data});
        }
        
    } catch (error) {
        res.status(400).send({success:false, msg:error.message});

    }
}



const search_product = async (req, res) =>{

    try {

        const search_data = req.body.search_data;
        const product_data = await Product.find({"name":{$regex: ".*"+search_data+".*", $options:'i'}});
        if(product_data.length > 0){

            res.status(200).send({success:true, msg:"Products details", data:product_data});


        }else{
            res.status(200).send({success:false, msg:"Products not found!!"});
        }
        
    } catch (error) {
        res.status(400).send({success:false, msg:error.message});

    }
}


module.exports = {
    add_product,
    get_product,
    search_product
}