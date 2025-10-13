const express = require("express");
const { validateUserMiddleware, validateIsAdminMiddleware } = require("../middlewares");
const { sendAdminInfoController } = require("./controllers");
const { adminOrdersRouter } = require("./orders/routes");
const { adminProductsRouter } = require("./products/routes");

const adminRouter = express.Router();
adminRouter.use(validateUserMiddleware);
adminRouter.use(validateIsAdminMiddleware);

adminRouter.get("/me", sendAdminInfoController);
adminRouter.use("/orders", adminOrdersRouter);
adminRouter.use("/products", adminProductsRouter);

module.exports = { adminRouter };