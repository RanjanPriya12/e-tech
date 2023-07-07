const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const cookie=require("cookie");

//authentication
exports.isAuthenticate = async (req, res, next) => {
  const  token  = (cookie.parse(req.headers.cookie)).Token;
  if (!token) {
    return res
      .status(400)
      .send({
        Success: false,
        message: "Authorization token not found or incorrect.",
      });
  }
  let decodeData;
  try {
    decodeData = jwt.verify(token, process.env.SECRET_KEY);
  } catch (error) {
    return res.status(400).send({ success: false, error: error.message });
  }
  req.user = await User.findById(decodeData.user._id);
  next();
};

//authorisation
exports.isAuthorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role)) {
        return next(res.status(403).send({Success:false,message:`Role: ${req.user.role} is not allowed to access this resource`}));
      }
    } catch (error) {
      return next(res.status(500).send({Success:false,error:error.message}));
    }
    next();
  };
};
