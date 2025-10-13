const mongoose = require("mongoose");
const { ProductModel } = require("../../../../models/productSchema");

const updateProductController = async (req, res) => {
    try{
        const data = req.body;
        const { productId } = req.params; 

        if(!mongoose.Types.ObjectId.isValid(productId)) {
            res.status(400).json({
            isSuccess: false,
            message: "Invalid productId format",
            data: {},
            });
            return;
        }

        const updateProduct = await ProductModel.findByIdAndUpdate(productId, data).lean();

        if(updateProduct === null){
            res.status(400).json({
                isSuccess: false,
                message: "productId does not match",
                data: {},
            });
        }

        res.status(200).json({
            isSuccess: true,
            message: "Product Updated",
            data:{ 
                updateProduct,
            },
        });
    }
    catch(err){
        console.log("----- Error inside updateProductController -----", err.message);

        if(err.name === "ValidationError" || err.code === 11000){
            res.status(400).json({
                isSuccess: false,
                message: err.message,
                data: {},
            });
            return;
        }

         res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
            data: {},
        });
    }
}

module.exports = { updateProductController };