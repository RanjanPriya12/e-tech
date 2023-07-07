const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = () =>{
    return mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser: true,
      });
}

module.exports = connectDB;