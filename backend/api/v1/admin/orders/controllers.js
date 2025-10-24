const { OrderModel } = require( "../../../../models/orderSchema");

const getOrdersForAdminController = async (req, res) => {
    try{
        console.log("----- getOrdersForAdminController -----");
        const orders = await OrderModel.find()
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

module.exports = { getOrdersForAdminController };