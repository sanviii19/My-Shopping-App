const express = require("express");
const { validateUserMiddleware } = require("../middlewares");
const { sendUserInfoController } = require("./controllers");

const usersRouter = express.Router();

console.log("----- usersRouter Loaded -----");

usersRouter.get("/me", validateUserMiddleware, sendUserInfoController);

module.exports = { usersRouter };