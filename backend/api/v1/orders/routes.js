const express = require("express");
const { placeOrderValidator, paymentStatusValidator } = require("./dto");
const { placeOrderController, createPaymentSessionController, getPaymentStatusController, getOrdersForClientController } = require("./controllers");
const { validateUserMiddleware } = require("../middlewares");
const { validate } = require("uuid");

const ordersRouter = express.Router();

console.log("----- ordersRouter Loaded -----");

// ordersRouter.post("/payment-session", validateUserMiddleware, createPaymentSessionController);
ordersRouter.post("/", validateUserMiddleware, placeOrderValidator, placeOrderController);
ordersRouter.get("/", validateUserMiddleware, getOrdersForClientController);
ordersRouter.get("/:orderId/payment-status", validateUserMiddleware, paymentStatusValidator, getPaymentStatusController);

module.exports = { ordersRouter };