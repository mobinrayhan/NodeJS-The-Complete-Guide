const User = require("../models/user");
const bcrypt = require("bcrypt");

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
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email.trim() }).then((user) => {
    if (!user) {
      req.flash("loginError", "User not found of this email!");
      return res.redirect("/login");
    }

    bcrypt.compare(password, user.password, (err, result) => {
      console.log(err);

      if (result) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        req.session.save(() => {
          req.flash("loginSuccess", "User Login successfully 💖💖");
          res.redirect("/");
        });
      } else {
        res.redirect("/login");
      }
    });
  });
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getSignUp = (req, res) => {
  const emailExist = req.flash("emailExist");
  const message = emailExist.length > 0 ? emailExist[0] : null;

  res.render("auth/signup", {
    pageTitle: "Sign Up",
    path: "/signup",
    message,
  });
};

exports.postSignUp = (req, res) => {
  const { email, password, confirmPassword } = req.body;
  User.findOne({ email: email.trim() }).then((isExistUser) => {
    if (isExistUser) {
      req.flash("emailExist", "User already exist . please login!");
      return res.redirect("/signup");
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      new User({
        email: email.trim(),
        password: hashedPassword,
        cart: { items: [] },
      })
        .save()
        .then(() => {
          res.redirect("/");
        })
        .catch((err) => console.log(err));
    });
  });
};
