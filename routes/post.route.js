const express = require("express");
const { isAuthenticate } = require("../middlewares/authorization");
const { isPostValidate } = require("../middlewares/postValidation");
const { createPost, getAllPost, getSinglePost, updatePost, deletePost } = require("../controllers/post.controller");
const router = express.Router();

router.route("/addPost").post(isPostValidate, createPost);
router.route("/:id").get(isAuthenticate, getSinglePost);
router.route("/allPosts").get(isAuthenticate, getAllPost);
router.route("/update-post/:id").put(isAuthenticate, updatePost);
router.route("/deletePost/:id").put(isAuthenticate, deletePost);
module.exports=router;