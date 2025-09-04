const mongoose = require("mongoose");

mongoose
    .connect(
        process.env.MONGODB_URL,
        {
            dbName: "secdb",
        }
    )
    .then(() => {
        console.log("----- MongoDB Connected -----");
    })
    .catch((err) => {
        console.log("----- MongoDB Connection Failed -----");
        console.log(err.message);
        console.log("----- ------------ -----");
    })