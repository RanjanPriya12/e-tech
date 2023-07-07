const { validationResult, check } = require("express-validator");

exports.isPostValidate = [
  check("title")
    .not()
    .isEmpty()
    .withMessage("Post title should not be blank")
    .exists()
    .isString()
    .withMessage("Title should be string")
    .isLength({ min: 20, max: 50 })
    .withMessage("Title should be more than 20 and less than 50 character")
    .trim(),
  check("content")
    .not()
    .isEmpty()
    .withMessage("Post content should not be blank")
    .exists()
    .isString()
    .withMessage("Post content should be in string")
    .isLength({ min: 50, max: 150 })
    .withMessage("Content should be more than 50 and less than 150 character")
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
