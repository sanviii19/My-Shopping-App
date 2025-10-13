const { CartModel } = require("../../../models/cartSchema");

const addToCartController = async (req, res) => {
    try{
        const {productId} = req.params;
        const {id: _id} = req.currentUser;

        const cartItem = await CartModel.findOne({
            userId : _id,
            productId : productId,
        });

        if(cartItem){
            await CartModel.findByIdAndUpdate(cartItem._id, {
                // $inc: { quantity: 1 }   better way to increment
                cartQuantity : cartItem.cartQuantity + 1,
            });
        }else{
            await CartModel.create({
                userId : _id,
                productId : productId,
            });
        }

        res.status(201).json({
            isSuccess: true,
            message: "Product Added",
        });
    }
    catch(err){
        console.log("----- Error inside addToCartController -----", err.message);

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
};

const getCartItemsController = async (req, res) => {
    try{
        const {id: _id} = req.currentUser;

        const cartItems = await CartModel.find({
            userId : _id,
        }).populate("productId").lean();

        res.status(200).json({
            isSuccess: true,
            message: "Cart Fetched",
            data: cartItems,
        });
    }
    catch(err){
        console.log("----- Error inside getCartItemsController -----", err.message);

         res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
            data: {},
        });
    }
};

const removeFromCartController = async (req, res) => {
    try{
        const {productId} = req.params;
        const {id: _id} = req.currentUser;

        const cartItem = await CartModel.findOne({
            userId : _id,
            productId : productId,
        });

        if(!cartItem){
            res.status(404).json({
                isSuccess: false,
                message: "Item not found in cart",
                data: {},
            });
            return;
        }

        if(cartItem.cartQuantity > 1){
            // Decrease quantity by 1
            await CartModel.findByIdAndUpdate(cartItem._id, {
                cartQuantity : cartItem.cartQuantity - 1,
            });
        } else {
            // Remove item completely if quantity is 1
            await CartModel.findByIdAndDelete(cartItem._id);
        }

        res.status(200).json({
            isSuccess: true,
            message: "Item removed from cart",
        });
    }
    catch(err){
        console.log("----- Error inside removeFromCartController -----", err.message);

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
};

const clearCartController = async (req, res) => {
    try{
        const {id: _id} = req.currentUser;

        await CartModel.deleteMany({
            userId : _id,
        });

        res.status(200).json({
            isSuccess: true,
            message: "Cart cleared successfully",
        });
    }
    catch(err){
        console.log("----- Error inside clearCartController -----", err.message);

         res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
            data: {},
        });
    }
};

module.exports = { addToCartController, getCartItemsController, removeFromCartController, clearCartController };