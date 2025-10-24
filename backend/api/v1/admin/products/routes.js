const express = require("express");
const { updateProductController, deleteProductController } = require("./controllers");
const { updateProductValidator } = require("./dto");

const adminProductsRouter = express.Router();

adminProductsRouter.patch("/:productId", updateProductValidator, updateProductController);
adminProductsRouter.delete("/:productId", deleteProductController);

module.exports = { adminProductsRouter };