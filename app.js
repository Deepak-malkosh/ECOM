const express = require('express');
const app = express();

const mongoose =  require('mongoose');
mongoose.connect('mongodb://localhost:27017/ECOM');

//user routes
const userRoute = require('./routes/user.routes');
app.use('/user',userRoute)

//store routes
const storeRoute = require('./routes/store.routes');
app.use('/store',storeRoute)


//category route
const categoryRoute = require('./routes/category.routes');
app.use('/category',categoryRoute);


//sub-category route
const subCategoryRoute = require('./routes/subcategory.routes');
app.use('/subCategory',subCategoryRoute);


//product route
const productRoute = require('./routes/product.routes');
app.use('/product',productRoute);


//common route
const commonRoute = require('./routes/common.routes');
app.use('/common', commonRoute)

//cart route
const cartRoute = require('./routes/cart.routes');
app.use('/cart',cartRoute);

//address route
const addressRoute = require('./routes/address.routes');
app.use('/address',addressRoute);


//Buy-product route
const buyProductRoute = require('./routes/buyProduct.routes');
app.use('/api',buyProductRoute);


app.listen('3001',() => {
    console.log(`server is running at port 3001`);
}); 