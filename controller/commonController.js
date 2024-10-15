const Product = require('../models/produceModel');
const User = require('../models/userModel');
const Category = require("../models/categoryModel");
const subCategory = require('../models/subCategoryModel');




const data_count = async (req, res) =>{

    try {

        var count_data = [];

        const product_data = await Product.find().countDocuments();
        const vendor_data = await User.find({type:1}).countDocuments();
        const category_data = await Category.find().countDocuments();
        const subCategory_data = await subCategory.find().countDocuments();

        count_data.push({
            product:product_data,
            vendor:vendor_data,
            category:category_data,
            sub_category:subCategory_data
        })

        res.status(200).send({success:true, msg:"Counting data", data:count_data});

    } catch (error) {
        res.status(400).send({success:false, msg:error.message});
    }
}





module.exports = {data_count}