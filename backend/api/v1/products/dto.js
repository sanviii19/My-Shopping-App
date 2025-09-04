const mongoose = require("mongoose");

const createProductValidator = (req, res, next) => {
    try{
        console.log("----- Inside createProductValidator -----");
        const { title, price, description, quantity } = req.body;

        if(!title || title.length < 2){
            res.status(400).json({
                isSucess: false,
                message: "title length must be > 2",
            });
            return;
        } 

        if(!price || price < 1){
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

        if(!quantity && quantity < 0){
            res.status(400).json({
                isSuccess: false,
                message: "quantity must be >= 0",
            });
            return;
        }

        next();
    }
    catch(err){
        console.log("----- Error inside createProductValidator -----", err.message);
        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
            data: {},
        });
    }
};

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
}

const deleteProductValidator = (req, res, next) => {
    try{
        console.log("----- Inside deleteProductValidator -----");
        
        const { productId } = req.params;

        if(!mongoose.Types.ObjectId.isValid(productId)){
            res.status(400).json({
                isSuccess: false,
                message: "Invalid productId",
                data: {},
            });
            return;
        }

        next();
    }
    catch(err){
        console.log("----- Error inside deleteProductValidator -----", err.message);
        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
            data: {},
        });
    }
};

module.exports = { createProductValidator, updateProductValidator, deleteProductValidator };