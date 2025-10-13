const mongoose = require("mongoose");   
const { ProductModel } = require("../../../../models/productSchema");

const updateProductValidator = (req, res, next) => {
    try{
        console.log("----- Inside updateProductValidator -----");
        const { title, price, description, quantity } = req.body;

        if(title && title.length < 2){
            res.status(400).json({
                isSucess: false,
                message: "title length must be > 2",
            });
            return;
        } 

        if(price && price < 1){
            res.status(400).json({
                isSuccess: false,
                message: "price must be >= 1",
            });
            return;
        }

        if(description && description.length < 5){
            res.status(400).json({
                isSuccess: false,
                message: "description length must be > 5", 
            });
            return;
        }

        if(quantity && quantity < 1){
            res.status(400).json({
                isSuccess: false,
                message: "quantity must be >= 1",
            });
            return;
        }

        next();
    }
    catch(err){
        console.log("----- Error inside updateProductValidator -----", err.message);
        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
            data: {},
        });
    }
};

module.exports = { updateProductValidator };