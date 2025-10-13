const express = require("express");
const { userSignupController, userLoginController, userLogoutController } = require("./controllers");
const { userSignupValidator, userLoginValidator } = require("./dto");
const { validateOtpMiddleware } = require("../otp/middlewares");

const authRouter = express.Router();

console.log("----- authRouter Loaded -----");

authRouter.post("/signup", userSignupValidator, validateOtpMiddleware, userSignupController);
authRouter.post("/login", userLoginValidator, userLoginController);
authRouter.get("/logout", userLogoutController);

module.exports = { authRouter };