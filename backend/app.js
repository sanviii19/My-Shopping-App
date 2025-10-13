require("dotenv").config();
require("./config/db");

const cron = require('node-cron');
const express = require("express");
const morgan = require("morgan");
const { apiRouter } = require("./api/routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { checkForAbandonedOrders } = require("./api/v1/orders/controllers");

const PORT = process.env.PORT || 3900;

const app = express();

app.use(cors ({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(cookieParser()); // Add cookie parser middleware

app.use((req, res, next) =>{
    setTimeout(() => {
        next();
    }, 2000);
})
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", apiRouter);

cron.schedule('*/1 * * * *', () => {
  console.log('running a task every minute');

  checkForAbandonedOrders();
});

app.listen(PORT, () => {
    console.log("----- Server Started -----");
})