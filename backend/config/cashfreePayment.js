const { Cashfree, CFEnvironment } = require("cashfree-pg"); 

const cashfreePayment = new Cashfree(
    CFEnvironment.SANDBOX,
    process.env.CASHFREE_APP_ID,
    process.env.CASHFREE_SECRET_KEY
);

module.exports = { cashfreePayment };