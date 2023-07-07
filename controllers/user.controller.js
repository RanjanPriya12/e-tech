const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary");
require("dotenv").config();
const cookie = require("cookie");

// generate token
const generateToken = (user) => {
  return jwt.sign({ user }, process.env.SECRET_KEY);
};

//register
exports.register = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.emil }).lean().exec();
    if (user) {
      return res
        .status(400)
        .send({ Success: false, message: "User already exists" });
    } else {
      user = await User.create(req.body);
      const token = generateToken(user);
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("Token", token, {
          httpOnly: true,
          maxAge: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
          ),
        })
      );
      return res.status(201).send({
        Success: true,
        message: "Account created successfully",
        user,
        token,
      });
    }
  } catch (error) {
    return res.status(500).send({ errors: error.message });
  }
};

//login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .send({ message: "Please Enter Your Email and Password" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send({ message: "Incorrect email or password" });
  } else {
    const match = await user.comparePassword(password);

    if (!match) {
      return res.status(400).send({ message: "Incorrect email or password" });
    } else {
      const token = generateToken(user);
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("Token", token, {
          httpOnly: true,
          maxAge: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
          ),
        })
      );
      return res.status(200).send({
        Success: true,
        message: "User login successfully",
        user,
        token,
      });
    }
  }
};

//update password
exports.updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(200)
        .send({ Success: true, message: "User with this id does not exists." });
    }
    const isPasswordMatched = await user.comparePassword(req.body.password);
    if (!isPasswordMatched) {
      return res
        .status(400)
        .send({ Success: true, message: "Incorrect Password." });
    }
    if (req.body.newPassword !== req.body.confirmPassword) {
      return res
        .status(400)
        .send({ Success: true, message: "Confirm Password does not matched." });
    }
    user.password = req.body.newPassword;
    await user.save();
    return res
      .status(400)
      .send({
        Success: true,
        message: "Your password is updated successfully.",
      });
  } catch (error) {
    return res.status(500).send({ Success: false, error: error.message });
  }
};

//update profile
exports.updateProfile = async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(200)
        .send({ success: true, message: "User does not exists." });
    } else {
      const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale",
      });
      const newUserData = {
        username: req.body.username,
        email: req.body.email,
        avatar: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
      };
      user = await User.updateOne(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      });
      await user.save();
      return res
        .status(200)
        .send({ success: true, message: "User data modified successfully." });
    }
  } catch (error) {
    return res.status(500).send({ success: true, error: error.message });
  }
};
