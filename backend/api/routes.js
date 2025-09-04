const express = require("express");
const { productRouter } = require("./v1/products/routes");

const apiRouter = express.Router();

apiRouter.use("/products", productRouter);

module.exports = { apiRouter };