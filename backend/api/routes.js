const express = require("express");
const { productRouter } = require("./v1/products/routes");
const { authRouter } = require("./v1/auth/routes");
const { otpRouter } = require("./v1/otp/routes");

const apiRouter = express.Router();

apiRouter.use("/products", productRouter);
apiRouter.use("/auth", authRouter); // api/v1/auth
apiRouter.use("/otp", otpRouter);

module.exports = { apiRouter };