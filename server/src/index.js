require('dotenv').config();
var mongoose = require('mongoose');
require("./db/conn");
const express = require('express');
const path = require("path");
const app = express();
const http = require('http').Server(app);
const userRoute = require('../Route/userRoute')
app.use("/",userRoute);
app.use(express.static(path.join(__dirname, "../../client/dist")));
app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,"../../client","dist","index.html"))
})

const port = process.env.PORT || 8000
http.listen(port, console.log(`server is runnong at PORT NO. ${port}`));