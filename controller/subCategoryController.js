const subCategory = require('../models/subCategoryModel');

const createSubCategory = async(req, res) =>{

    try {

        const check_subCat = await subCategory.find({category_id:req.body.category_id});

        if(check_subCat.length > 0){

            let checking = false;
            for(let i=0; i<check_subCat.length; i++){

                if(check_subCat[i]['sub_category'].toLowerCase() === req.body.sub_category.toLowerCase()){
                    checking = true;
                    break;
                }
            }

            if(checking === false){

                const newSubCategory =  new subCategory({
                    category_id:req.body.category_id,
                    sub_category:req.body.sub_category
                });
        
        
                const sub_cat_data = await newSubCategory.save();
                res.status(200).send({success:true, msg:"A new sub-category Details", data:sub_cat_data});

            }else{
                res.status(200).send({success:true, msg:"This sub-category ("+req.body.sub_category +") is already exist"});
            }

        }
        else{

            const newSubCategory =  new subCategory({
                 category_id:req.body.category_id,
                 sub_category:req.body.sub_category
             });
     
     
             const sub_cat_data = await newSubCategory.save();
             res.status(200).send({success:true, msg:"A new sub-category Details", data:sub_cat_data});
        }

        
    } catch (error) {
        res.status(400).send({success:false, msg:error.message});
    }
}





module.exports = {
    createSubCategory,
}