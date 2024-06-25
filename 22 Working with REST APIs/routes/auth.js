const express = require("express");
const { postSignUp, postLogin } = require("../controller/auth");
const { body } = require("express-validator");
const User = require("../model/user");
const router = express.Router();

router.put(
  "/signup",
  [
    body("name", "Name Should be stay").trim().isString(),
    body("password", "Please enter a password at least 5 character long")
      .trim()
      .isLength({ min: 5 }),
    body("email")
      .trim()
      .isEmail()
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject(
              "A user already exists with this e-mail address",
            );
          }
        });
      })
      .normalizeEmail(),
  ],
  postSignUp,
);

router.post("/login", postLogin);

module.exports = router;
