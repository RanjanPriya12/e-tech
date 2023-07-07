const express=require('express');
const cors=require('cors');
const connectDB = require('./configs/db');
require('dotenv').config();
const path = require("path");
const cloudinary = require("cloudinary");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const postRoute=require('./routes/post.route');
const userRoute=require('./routes/user.route');

const app=express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
const port = process.env.PORT || 5000;

app.use('/api/myBlogApp/post',postRoute);
app.use('/api/myBlogApp',userRoute);

// cloud file upload
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
  });
  

app.listen(port,async()=>{
    try {
        await connectDB();
        console.log(`application is running at port http://localhost:${port}`);
    } catch (error) {
        console.log("error",error);
    }
})