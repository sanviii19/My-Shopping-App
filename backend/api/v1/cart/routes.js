const express = require("express");
const { addToCartValidator, removeFromCartValidator } = require("./dto");
const { addToCartController, getCartItemsController, removeFromCartController, clearCartController } = require("./controllers");
const { validateUserMiddleware } = require("../middlewares");

const cartRouter = express.Router();

console.log("----- cartRouter Loaded -----");

cartRouter.get("/", validateUserMiddleware, getCartItemsController);

cartRouter.post("/:productId", validateUserMiddleware, addToCartValidator, addToCartController);

cartRouter.delete("/:productId", validateUserMiddleware, removeFromCartValidator, removeFromCartController);

cartRouter.delete("/", validateUserMiddleware, clearCartController);

module.exports = { cartRouter };