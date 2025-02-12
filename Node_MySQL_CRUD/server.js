const express = require("express");
const dotenv = require("dotenv");
const mysql = require("mysql2/promise"); 
const mySqlPool = require("./config/db"); 

//configure dotenv
dotenv.config();

//rest object
const app = express();

//middlewares
app.use(express.json())

//routes
app.use("/api/v1/student", require("./routes/studentRoutes"));

app.get("/test", (req,res) => {
    res.status(200).send("<h1>Nodejs Mysql App</h1>");
});

//port
const port = process.env.PORT || 8000;

//conditionally Listen
mySqlPool.query('SELECT 1').then(() => {
    //My SQL
    console.log('MySQL DB Connected')
    //listen
    app.listen( port, () => {
        console.log(`Server Running on port ${process.env.PORT}`);
    });
}).catch((error) => {
    console.log(error);
})
