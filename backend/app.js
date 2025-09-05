require("dotenv").config();
require("./config/db");

const express = require("express");
const morgan = require("morgan");
const { apiRouter } = require("./api/routes");
const cors = require("cors");

const PORT = process.env.PORT || 3900;

const app = express();

app.use(cors ({
    origin: process.env.FRONTEND_URL
}));

// app.use((req, res, next) =>{
//     setTimeout(() => {
//         next();
//     }, 2000);
// })
app.use(morgan("dev"));
app.use(express.json());

app.use("/api/v1", apiRouter);

app.listen(PORT, () => {
    console.log("----- Server Started -----");
})