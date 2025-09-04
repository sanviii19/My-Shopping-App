const express = require("express");
const { createProductController,
    getProductController,
    updateProductController,
    deleteProductController,
    listProductController } = require("./controllers");
    
const { createProductValidator, updateProductValidator, deleteProductValidator } = require("./dto");
const productRouter = express.Router();

console.log("----- productRouter Loaded -----");

productRouter.get("/", listProductController);

productRouter.get("/all", getProductController);

productRouter.post("/", createProductValidator, createProductController);

productRouter.patch("/:productId", updateProductValidator, updateProductController);

productRouter.delete("/:productId", deleteProductValidator, deleteProductController);

module.exports = { productRouter };