require('./config/config')
const express = require("express");
require('dotenv').config();
const studentRouter = require('./router/routers')
const port = process.env.port 

const app =  express();

app.use(express.json());
app.use('/api/student', studentRouter); 

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
}) 