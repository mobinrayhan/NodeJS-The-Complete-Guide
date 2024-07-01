const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

exports.getLogin = (req, res) => {
  const loginError = req.flash("loginError");
  const loginSuccess = req.flash("loginSuccess");

  const message =
    (loginError.length > 0 ? loginError[0] : null) ||
    (loginSuccess.length > 0 ? loginSuccess[0] : null);

  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    message: message,
    prevInputData: { email: "", password: "" },
  });
};

exports.postLogin = (req, res, next) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      pageTitle: "Log in",
      path: "/login",
      message: errors.array()[0].msg,
      prevInputData: {
        email,
        password,
      },
    });
  }

  User.findOne({ email: email.trim() })
    .then((user) => {
      console.log(user);
      if (!user) {
        req.flash("loginError", "User not found of this email!");
        return res.status(422).render("auth/login", {
          pageTitle: "Log in",
          path: "/login",
          message: "",
          prevInputData: {
            email,
            password,
          },
        });
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          req.session.save(() => {
            res.redirect("/");
          });
        } else {
          return res.status(422).render("auth/login", {
            pageTitle: "Log in",
            path: "/login",
            message: "User Credentials wrong",
            prevInputData: {
              email,
              password,
            },
          });
        }
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
};

exports.getSignUp = (req, res) => {
  const emailExist = req.flash("emailExist");
  const message = emailExist.length > 0 ? emailExist[0] : null;

  res.render("auth/signup", {
    pageTitle: "Sign Up",
    path: "/signup",
    message,
    prevInputData: { email: "", password: "", confirmPassword: "" },
  });
};

exports.postSignUp = (req, res, next) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      pageTitle: "Signup",
      path: "/signup",
      message: errors.array()[0].msg,
      prevInputData: {
        email,
        password,
        confirmPassword: req.body.confirmPassword,
      },
    });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    new User({
      email: email.trim(),
      password: hashedPassword,
      cart: { items: [] },
    })
      .save()
      .then(() => {
        res.redirect("/login");
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(err);
      });
  });
};

exports.getReset = (req, res) => {
  const userExist = req.flash("userExist");
  const message = userExist.length > 0 ? userExist[0] : null;

  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
    message,
  });
};

exports.postReset = (req, res, next) => {
  const { email } = req.body;
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      res.redirect("/reset");
    }

    const token = buffer.toString("hex");
    User.findOne({ email: email.trim() })
      .then((user) => {
        if (!user) {
          req.flash("userExist", "User not found with this appropriate email");
          res.redirect("/reset");
        }

        user.token = token;
        user.resetExpiryDate = Date.now() + 3600000;
        return user.save();
      })
      .then(() => {
        const mailOptions = {
          from: {
            name: "Mobin's Node Application",
            address: "shop@node-shop-mobin.com",
          },
          to: email,
          subject: "Reset Password",
          html: `
          <p>You requested a password reset</p>
          <h3>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a password</h3>
          `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error("Error sending email: ", error);
          } else {
            res.redirect("/");
            console.log("Email sent: ", info.response);
          }
        });
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        next(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const { token } = req.params;

  User.findOne({ token, resetExpiryDate: { $gt: Date.now() } })
    .then((user) => {
      const emailExist = req.flash("emailExist");
      const message = emailExist.length > 0 ? emailExist[0] : null;

      if (!user) {
        return res.redirect("/");
      }

      res.render("auth/new-password", {
        pageTitle: "New Password",
        path: "/reset",
        message: message,
        userId: user._id.toString(),
        token,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const { password, userId, token } = req.body;

  User.findOne({
    _id: userId,
    token,
    resetExpiryDate: { $gt: Date.now() },
  })
    .then((user) => {
      bcrypt.hash(password, 10, (err, result) => {
        if (err) {
          console.log(err);
        }

        user.password = result;
        user.resetExpiryDate = undefined;
        user.token = undefined;
        user.save().then(() => res.redirect("/login"));
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(err);
    });
};
