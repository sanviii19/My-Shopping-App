const { isValidObjectId } = require("mongoose");

const addToCartValidator =  (req, res, next) => {
    try{
        console.log("-----inside addToCartValidator -----");
        const { productId } = req.params;

        if(!productId){
            res.status(400).json({
            isSuccess: false,
            message: "Product ID is required"
        });
        return;
        }

        // valid id in object format as specified by mongodb
        if(!isValidObjectId(productId)){
            res.status(400).json({
                isSuccess: false,
                message: "Invalid User ID or Product ID"
            });
            return;
        }

        next();
    }catch(err){
        console.log("----- Error in addToCartValidator -----");
        console.log(err.message);
        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error"
        });
        return;
    }
}

const removeFromCartValidator = (req, res, next) => {
    try{
        console.log("-----inside removeFromCartValidator -----");
        const { productId } = req.params;

        if(!productId){
            res.status(400).json({
            isSuccess: false,
            message: "Product ID is required"
        });
        return;
        }

        // valid id in object format as specified by mongodb
        if(!isValidObjectId(productId)){
            res.status(400).json({
                isSuccess: false,
                message: "Invalid Product ID"
            });
            return;
        }

        next();
    }catch(err){
        console.log("----- Error in removeFromCartValidator -----");
        console.log(err.message);
        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error"
        });
        return;
    }
}

module.exports = { addToCartValidator, removeFromCartValidator };