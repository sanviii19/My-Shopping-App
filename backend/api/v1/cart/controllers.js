const { CartModel } = require("../../../models/cartSchema");

const addToCartController = async (req, res) => {
    try{
        const {productId} = req.params;
        const {_id} = req.currentUser;

        const cartItem = await CartModel.findOne({
            userId : _id,
            productId : productId,
        });

        if(cartItem){
            await CartModel.findByIdAndUpdate(cartItem._id, {
                $inc: { cartQuantity: 1 }  // Use $inc for atomic increment
            });
        }else{
            await CartModel.create({
                userId : _id,
                productId : productId,
            });
        }

        const cartItems = await CartModel.find({
            userId: _id,
        })
            .populate("productId")
            .lean();

        res.status(201);
        res.json({
            isSuccess: true,
            message: "Product added to cart!",
            data: {
                cart: cartItems,
            },
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
        const {_id} = req.currentUser;

        const cartItems = await CartModel.find({
            userId : _id,
        }).populate("productId").lean();

        res.status(200).json({
            isSuccess: true,
            message: "Cart fetched successfully",
            data: {
                cartItems: cartItems,
                cartCount: cartItems.length,
            },
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
        const {_id} = req.currentUser;

        const cartItem = await CartModel.findOne({
            userId : _id,
            productId : productId,
        });

        if (cartItem) {
            if (cartItem.cartQuantity == 1) {
                await CartModel.findByIdAndDelete(cartItem._id);
            } else {
                await CartModel.findByIdAndUpdate(cartItem._id, {
                    cartQuantity: cartItem.cartQuantity - 1,
                    // $inc: { cartQuantity: -1 }, // try to ask
                });
            }
        } else {
            res.status(400).json({
                isSuccess: false,
                message: "Product not in the cart!",
            });
        }

        const cartItems = await CartModel.find({
            userId: _id,
        })
            .populate("productId")
            .lean();

        res.status(201);
        res.json({
            isSuccess: true,
            message: "Product removed from cart!",
            data: {
                cart: cartItems,
            },
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
        const {_id} = req.currentUser;

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