const express = require("express");
const { productRouter } = require("./v1/products/routes");
const { authRouter } = require("./v1/auth/routes");
const { otpRouter } = require("./v1/otp/routes");
const { usersRouter } = require("./v1/users/routes");
const { cartRouter } = require("./v1/cart/routes");
const { ordersRouter } = require("./v1/orders/routes");
const { adminRouter } = require("./v1/admin/routes");

const apiRouter = express.Router();

apiRouter.use("/products", productRouter);
apiRouter.use("/auth", authRouter); // api/v1/auth
apiRouter.use("/otp", otpRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/cart", cartRouter);
apiRouter.use("/orders", ordersRouter);
apiRouter.use("/admins", adminRouter);


module.exports = { apiRouter };