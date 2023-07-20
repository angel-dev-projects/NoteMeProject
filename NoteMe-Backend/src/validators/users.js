const { check } = require("express-validator");
const { validateResult } = require("../helpers/validateHelper");
const User = require("../models/user");

// Validation new user
const validateCreate = [
  check("username")
    .exists()
    .not()
    .isEmpty()
    .isLength({
      min: 4,
      max: 15,
    })
    .withMessage("Username is required and must be between 4 and 15 characters")
    .custom(async (value) => {
      const user = await User.findOne({
        username: value,
      });
      if (user) {
        throw new Error("Username already exists");
      }
      return true;
    }),

  check("email")
    .exists()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Email is required and must be a valid email")
    .custom(async (value) => {
      const user = await User.findOne({
        email: value,
      });
      if (user) {
        throw new Error("Email already exists");
      }
      return true;
    }),

  check("password")
    .exists()
    .not()
    .isEmpty()
    .isLength({
      min: 8,
      max: 15,
    })
    .withMessage("Password is required and must be between 8 and 15 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

// Validation edit user
const validateEdit = [
  check("username")
    .optional()
    .not()
    .isEmpty()
    .isLength({
      max: 15,
    })
    .withMessage("Username is required and must be between 4 and 15 characters")
    .custom(async (value, { req }) => {
      const user = await User.findOne({
        username: value,
        _id: {
          $ne: req.params.id,
        },
      });
      if (user) {
        throw new Error("Username already exists");
      }
      return true;
    }),

  check("email")
    .optional()
    .not()
    .isEmpty()
    .isEmail()
    .withMessage("Email is required and must be a valid email")
    .custom(async (value, { req }) => {
      const user = await User.findOne({
        email: value,
        _id: {
          $ne: req.params.id,
        },
      });
      if (user) {
        throw new Error("Email already exists");
      }
      return true;
    }),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

// Validation change password
const validateChangePassword = [
  check("password")
    .notEmpty()
    .withMessage("The new password is required")
    .isLength({
      min: 8,
      max: 15,
    })
    .withMessage("Password is required and must be between 8 and 15 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number"),

  check("confirmPassword")
    .notEmpty()
    .withMessage("Enter the new password again")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("The new password and the confirm password must match");
      }
      return true;
    }),

  (req, res, next) => {
    validateResult(req, res, next);
  },
];

module.exports = {
  validateCreate,
  validateEdit,
  validateChangePassword,
};
