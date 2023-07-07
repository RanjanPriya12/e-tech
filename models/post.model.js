const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    title:{ type:String,required:true},
    content:{type:String,required:true},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:"user",required:true}
},{
    timestamps:true,
    versionKey:false
});

const Post = new mongoose.model("post",postSchema);
module.exports=Post;