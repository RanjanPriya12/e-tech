const { validationResult, check } = require("express-validator");

exports.isUserValidate = [
  check("username")
    .not()
    .isEmpty()
    .withMessage("User name should not be blank")
    .exists()
    .isString()
    .withMessage("User name should be string")
    .isLength({ min: 3, max: 30 })
    .withMessage("User name should be more than 3 and less than 30 character")
    .trim(),
  check("email")
    .not()
    .isEmpty()
    .withMessage("Please enter your email id")
    .exists()
    .isEmail()
    .withMessage("Invalid email address found")
    .trim(),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Password should not be blank")
    .exists()
    .isString()
    .withMessage("lastName should be string")
    .isLength({ min: 8, max: 30 })
    .withMessage("Password should be more than 8 and less than 30 character")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, "i")
    .withMessage("Please enter a strong password.")
    .trim(),
  function (req, res, next) {
    var errorValidation = validationResult(req);
    if (errorValidation.length>0) {
      return res.status(400).json({
        title: "An error occured",
        error: errorValidation,
      });
    }
    next();
  },
];
