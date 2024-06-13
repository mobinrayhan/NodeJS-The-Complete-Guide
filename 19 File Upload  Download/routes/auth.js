const express = require("express");
const { body } = require("express-validator");
const {
  getLogin,
  postLogin,
  postLogout,
  getSignUp,
  postSignUp,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
} = require("../controllers/auth");
const User = require("../models/user");

const router = express.Router();

router.get("/login", getLogin);
router.post(
  "/login",
  body("email", "Please enter a valid email!").isEmail().trim(),
  postLogin,
);

router.post(
  "/logout",

  postLogout,
);

router.get(
  "/signup",

  getSignUp,
);
router.post(
  "/signup",
  [
    body("email", "Please enter a valid email!")
      .isEmail()
      .trim()
      .custom((value, {}) => {
        return User.findOne({ email: value.trim() }).then((user) => {
          if (user) {
            return Promise.reject(
              "User already exist !! please pick different one ",
            );
          }
        });
      }),
    body(
      "password",
      "Please enter a password with only numbers and text at least 5 characters",
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password did not match!");
      }
      return true;
    }),
  ],
  postSignUp,
);

router.get("/reset", getReset);
router.post("/reset", postReset);

router.get("/reset/:token", getNewPassword);
router.post("/update-password", postNewPassword);

// router.get("/login", userAuth, getLogin);
// router.post("/login", postLogin);
//
// router.post("/logout", postLogout);
//
// router.get("/signup", userAuth, getSignUp);
// router.post("/signup", postSignUp);
//
// router.get("/reset", userAuth, getReset);
// router.post("/reset", postReset);
//
// router.get("/reset/:token", getNewPassword);
// router.post("/update-password", postNewPassword);

module.exports = router;
