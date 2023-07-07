const express = require("express");
const { register, login, updatePassword, updateProfile } = require("../controllers/user.controller");
const { isAuthenticate } = require("../middlewares/authorization");
const { isUserValidate } = require("../middlewares/userValidation");
const router = express.Router();

router.route("/register").post(isUserValidate, register);
router.route("/login").post(login);
router.route("/update-password").put(isAuthenticate, updatePassword);
router.route("/me/updateprofile/:id").put(isAuthenticate, updateProfile);
module.exports=router;