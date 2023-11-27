const mongoose = require('mongoose');
require('dotenv').config();

const DB = process.env.database

mongoose.connect(DB)
.then(() => {
    console.log("connection established successfully"); 
  })
.catch((error) => {
    console.log(error.message);
  });
