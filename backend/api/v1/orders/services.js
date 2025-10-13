const { cashfreePayment } = require("../../../config/cashfreePayment");

const createPaymentSession = async ({ totalAmount, orderId, userId, primaryContact }) => {
        console.log("-----inside createPaymentSession -----");

        // Validate required parameters
        if (!userId) {
            throw new Error("Customer ID is required for payment processing");
        }
        if (!primaryContact) {
            throw new Error("Customer phone number is required for payment processing");
        }
        if (!totalAmount || totalAmount <= 0) {
            throw new Error("Valid order amount is required for payment processing");
        }
        if (!orderId) {
            throw new Error("Order ID is required for payment processing");
        }

        // Check if Cashfree credentials are configured
        if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
            console.log("⚠️ Cashfree credentials not configured, order will be placed without payment processing");
            throw new Error("Payment gateway not configured");
        }

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
        cashFreePaymentGateway
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
    cashfreePayment.PGOrderFetchPayments(orderId)
        .then((response) => {
            resolve(response.data);
        }).catch((error) => {
            reject(error.response.data.message);
        });
    });

    return paymentDetails;
}

module.exports = { createPaymentSession, getPaymentDetails };