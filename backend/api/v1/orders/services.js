const { cashfreePayment } = require("../../../config/cashfreePayment");

const createPaymentSession = async ({ totalAmount, orderId, userId, primaryContact }) => {
        console.log("-----inside createPaymentSession -----");

        // Check if Cashfree credentials are configured
        if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
            console.log("⚠️ Cashfree credentials not configured, order will be placed without payment processing");
            throw new Error("Payment gateway not configured");
        }

        console.log(`🟡 : { totalAmount, orderId, userId, primaryContact }:`, {
            totalAmount,
            orderId,
            userId,
            primaryContact,
        });

        var request = {
            "order_amount": totalAmount,
            "order_currency": "INR",
            "order_id": orderId,
            "customer_details": {
                "customer_id": userId,
                "customer_phone": primaryContact,
            },
            "order_meta": {
                "return_url": "https://www.cashfree.com/devstudio/preview/pg/web/popupCheckout?order_id={order_id}"
            }
        };
        
        const paymentSession = new Promise((resolve, reject) => {
        cashfreePayment
            .PGCreateOrder(request)
            .then((response) => {
                console.log("---- Order created successfully for", userId, "----");
                resolve(response.data);
            })
            .catch((error) => {
                console.log("🟡 : error:", error.response.data);
                reject(error.response.data.message);
            });
    });

    return paymentSession;
}

const getPaymentDetails = async ({orderId}) => {
    const paymentDetails = new Promise( (resolve, reject) => {
    cashfreePayment
    .PGOrderFetchPayments(orderId)
        .then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error.response.data.message);
        });
    });

    return paymentDetails;
}

module.exports = { createPaymentSession, getPaymentDetails };