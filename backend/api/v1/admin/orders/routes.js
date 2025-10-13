const express = require("express");
const { getOrdersForAdminController } = require("./controllers");

const adminOrdersRouter = express.Router();

adminOrdersRouter.use("/", getOrdersForAdminController);

module.exports = { adminOrdersRouter };