const express = require("express");
const { createProductController,
    getProductController,
    updateProductController,
    deleteProductController,
    listProductController, 
    viewProductController} = require("./controllers");
    
const { createProductValidator, updateProductValidator, deleteProductValidator, viewProductValidator } = require("./dto");
// const { validateUserMiddleware } = require("../middlewares");
const productRouter = express.Router();

console.log("----- productRouter Loaded -----");

// productRouter.use(validateUserMiddleware);
productRouter.get("/", listProductController);

productRouter.get("/all", getProductController);

productRouter.post("/", createProductValidator, createProductController);

productRouter.patch("/:productId", updateProductValidator, updateProductController);

productRouter.delete("/:productId", deleteProductValidator, deleteProductController);

productRouter.get("/view/:productId", viewProductValidator, viewProductController);

module.exports = { productRouter };