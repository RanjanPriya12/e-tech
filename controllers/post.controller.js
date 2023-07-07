const Post = require("../models/post.model");
const cloudinary = require("cloudinary");

//create post
const createPost = async (req, res) => {
  try {
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "Avtaar",
      width: 550,
      crop: "scale",
    });
    const { title, content } = req.body;
    const post = await Post.create({
      title,
      content,
      avatar: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      },
    });
    return res.status(201).json({
      success: true,
      message: "Your Post Created Successfully",
      post: post,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

//get single post by id
const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res
        .status(404)
        .json({
          success: false,
          message: `Post does not exists with Id:${req.params.id}`,
        });
    }
    res.status(200).json({ success: true, post: post });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

//get all posts
const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find({}).lean().exec();
    return res.status(200).json({ success: true, posts: posts });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// delete post
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: `Post does not exists with Id:${req.params.id}`,
      });
    } else {
      await post.remove();
      return res.status(200).json({
        success: true,
        message: `Post with Id:${req.params.id} deleted successfully.`,
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

//update post
const updatePost = async(req,res)=>{
    try {
        let post = await Post.findById(req.params.id);
        if (!post) {
          return res
            .status(200)
            .send({ success: true, message: "Post does not exists." });
        } else {
          const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale",
          });
          const newPostInfo = {
            title: req.body.title,
            content: req.body.content,
            avatar: {
              public_id: myCloud.public_id,
              url: myCloud.secure_url,
            },
          };
          post = await Post.findByIdAndUpdate(req.params.id, newPostInfo, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
          });
          await user.save();
          return res
            .status(200)
            .send({ success: true, message: "Post data updated successfully." });
        }
      } catch (error) {
        return res.status(500).send({ success: false, error: error.message });
      }
}

module.exports = { createPost, getSinglePost, getAllPost, deletePost, updatePost };
