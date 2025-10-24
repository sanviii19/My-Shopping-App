const { CartModel } = require("../../../models/cartSchema");
const { OrderModel } = require("../../../models/orderSchema");
const { ProductModel } = require("../../../models/productSchema");
const mongoose = require("mongoose");
const { createPaymentSession, getPaymentDetails } = require("./services");

const placeOrderController = async (req, res) => {
    try {
        console.log("--------- inside placeOrderController ----------");
        console.log("Controller received body:", req.body);
        console.log("req.currentUser:", JSON.stringify(req.currentUser, null, 2));
        console.log("req.currentUser._id:", req.currentUser._id);
        console.log("req.currentUser.id:", req.currentUser.id);
        const { fullName, streetAddress, city, state, primaryContact, alternateContact } = req.body;

        // Try both _id and id for backward compatibility during transition
        const userId = req.currentUser._id || req.currentUser.id;
        console.log("Extracted userId:", userId);

        const cartItems = await CartModel.find({
            userId: userId,
        });

        if (cartItems.length === 0) {
            res.status(400).json({
                isSuccess: false,
                message: "Cart is Empty!",
            });
            return;
        }

        // let allItemsAreInStock = true;

        // for (let product of cartItems) {
        //     const { product: productId, cartQuantity: quantity } = product;
        //     const updatedProduct = await ProductModel.findByIdAndUpdate(productId, {
        //         $inc: { quantity: -1 * quantity },
        //     });

        //     if (updatedProduct && updatedProduct.quantity < 0) {
        //         allItemsAreInStock = false;
        //     }
        // }

        // if (!allItemsAreInStock) {
        //     for (let product of cartItems) {
        //         const { product: productId, cartQuantity: quantity } = product;
        //         await ProductModel.findByIdAndUpdate(productId, {
        //             $inc: { quantity: quantity },
        //         });
        //     }

        //     res.status(500).json({
        //         isSuccess: false,
        //         message: "Some items are not in stock!",
        //         data: {},
        //     });
        //     return;
        // }
        console.log("----- starting Session -----");

        const session = await mongoose.startSession();

        let newOrder = null;
        let totalAmount = 0;
        let paymentResult = null;

        try {
            console.log("----- Transaction started -----");
            await session.withTransaction(async () => {
                const productsToOrder = [];

                for (let cartItem of cartItems) {
                    const { productId: productId, cartQuantity } = cartItem;
                    
                    // Validate ObjectId format
                    if (!mongoose.Types.ObjectId.isValid(productId)) {
                        throw new Error(`Invalid product ID format: ${productId}`);
                    }
                    console.log("🟡 : productId:", productId);

                    const existingProduct = await ProductModel.findById(productId).lean();

                    console.log("🟡 : existingProduct:", existingProduct);
                    console.log("🟡 : cartItem:", cartItem); 

                    productsToOrder.push({
                        product: cartItem.productId,
                        cartQuantity: cartItem.cartQuantity,
                        price: existingProduct.price,
                    });

                    totalAmount += cartItem.cartQuantity * existingProduct.price;

                    console.log("🟡 : totalAmount so far:", totalAmount);

                    if (!existingProduct) {
                        throw new Error("Invalid product in the cart!");
                    } else if (existingProduct.quantity < cartQuantity) {
                        throw new Error("Some items are out of stock!");
                    } else {
                        const updatedProduct = await ProductModel.findByIdAndUpdate(productId, {
                            $inc: { quantity: -1 * cartQuantity },
                        }).session(session);
                        console.log("🟡 : updatedProduct:", updatedProduct);

                        if (updatedProduct.quantity < 0) {
                            throw new Error("Some items are out of stock!");
                        }
                    }
                }

                newOrder = await OrderModel.create(
                    [
                        {
                            userId: userId,
                            productIds: productsToOrder,
                            address: `Name:${fullName}\n Address:${streetAddress}\n City: ${city}\n State: ${state}`,
                            contactNumbers: [primaryContact, alternateContact],
                        },
                    ],
                    { session }
                );

                try {
                    paymentResult = await createPaymentSession({
                        userId,
                        totalAmount,
                        orderId: newOrder[0]._id,
                        primaryContact: primaryContact,
                    });
                }catch(err){
                    session.abortTransaction();
                    throw new Error(err.message || "Payment Gateway Error");
                }
                    
                    // Update order with payment details if payment session was created
                await OrderModel.findByIdAndUpdate(
                    newOrder[0]._id,
                    {
                        paymentDetails: paymentResult,
                        paymentSessionId: paymentResult.payment_session_id,
                    },
                    { session: session }
                );
            });

            console.log(`payment session Id ${paymentResult.payment_session_id}`);

        } catch (err) {
            console.log("----- Transaction Error -----", err.message);
            res.status(409).json({
                isSuccess: false,
                message: err.message,
                data: {},
            });
            return;
        }

        await CartModel.deleteMany({
            userId: userId,
        });

         res.status(201).json({
            isSuccess: true,
            message: "Order placed!",
            data: {
                paymentDetails: paymentResult,
                orderId: newOrder[0]._id,
            },
        });

        // const responseData = {
        //     orderId: newOrder[0]._id,
        // };
        
        // // Add payment session ID if payment was processed
        // if (paymentResult && paymentResult.payment_session_id) {
        //     responseData.paymentSessionId = paymentResult.payment_session_id;
        //     responseData.paymentDetails = paymentResult;
        // }

    } catch (err) {
        console.log("--------- error in placeOrderController ----------");
        console.log("Error message:", err.message);
        console.log("Error name:", err.name);
        console.log("Error code:", err.code);
        console.log("Full error:", err);

        if (err.name === "ValidationError" || err.code == 11000) {
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

const getPaymentStatusController = async (req, res) => {
    try {
        console.log("------- inside getPaymentStatusController --------");
        const { orderId } = req.params;

        const paymentDetails = await getPaymentDetails({orderId});

        if(paymentDetails.length !== 0){    
            const {payment_status} = paymentDetails[0];

            if(payment_status !== null && payment_status !== undefined){
                // Determine order status based on payment status
                let orderStatus = "pending";
                if (payment_status === "SUCCESS") {
                    orderStatus = "completed";
                } else if (payment_status === "FAILED" || payment_status === "CANCELLED") {
                    orderStatus = "failed";
                } else if (payment_status === "PENDING") {
                    orderStatus = "pending";
                }

                await OrderModel.findByIdAndUpdate(orderId, {
                    lastUpdatedpaymentDetails: paymentDetails[0],
                    paymentStatus: payment_status,
                    orderStatus: orderStatus,
                });
            }else{
                throw new Error("Payment status key is not present");
            }
        }

        res.status(200).json({
            isSuccess: true,
            message: "Payment details fetched successfully",
            data: (
                paymentDetails
            )
        });
    }catch (err) {
        console.log("------- 🔴 Error in getPaymentStatusController --------", err.message);
        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error",
        });
    }
};

const getOrdersForClientController = async (req, res) => {
    try{
        console.log("----- getOrdersForClientController -----");
        const { _id } = req.currentUser;
        
        const orders = await OrderModel.find({ userId: _id })
        .select("-lastUpdatedpaymentDetails -paymentDetails -paymentSessionId")
        .populate("userId", "email")
        .populate("productIds.product", "title price images")
        .sort({ createdAt: -1 });

        res.status(200).json({
            isSuccess: true,
            message: "Orders fetched successfully",
            data: { orders }, 
        })
    }catch(err){
        console.log("----- Error in getOrdersForAdminController -----");
        console.log(err.message);

        res.status(500).json({
            isSuccess: false,
            message: "Internal Server Error"
        });
        return;
    }
}

const checkForAbandonedOrders = async () => {
    try{
        console.log("----- checkForAbandonedOrders -----");
        const currentTime = Date.now();
        const before5minutes = currentTime - 5 * 60 * 1000;

        const orders = await OrderModel.find({
            paymentStatus: "INITIALIZED",
            createdAt: {
                $lte: before5minutes
            }
        }).lean();

        for (let order of orders) {
            const paymentDetails = await getPaymentDetails({ orderId: order._id });

            if (paymentDetails.length !== 0) {
                const { payment_status } = paymentDetails[0];

                if (payment_status !== null && payment_status !== undefined) {
                    await OrderModel.findByIdAndUpdate(order._id, {
                        lastUpdatedPaymentDetails: paymentDetails[0],
                        paymentStatus: payment_status,
                    });
                }
            } else {
                const { products } = order;
                for (let product of products) {
                    await ProductModel.findByIdAndUpdate(
                        product.product,
                        {
                            $inc: { quantity: product.cartQuantity },
                        },
                        { new: true }
                    );
                }
                await OrderModel.findByIdAndUpdate(
                    order._id,
                    {
                        paymentStatus: "ABANDONED",
                    },
                    { new: true }
                );
            }
        }
 
        console.log("----- Abandoned Orders Checked -----");
    }catch(err){
        console.log("----- Error in checkForAbandonedOrders -----");
        console.log(err.message);
    }
}

module.exports = { placeOrderController, getPaymentStatusController, getOrdersForClientController, checkForAbandonedOrders };