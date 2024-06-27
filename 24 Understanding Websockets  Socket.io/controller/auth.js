const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const User = require("../model/user");
const jwt = require("jsonwebtoken");

exports.postSignUp = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const error = new Error("Validation failed. entered data was incorrect!");
    error.statusCode = 403;
    throw error;
  }

  const { email, password, name } = req.body;

  bcrypt.hash(password, 12, function (err, hashedPassword) {
    if (err) {
      const error = new Error(
        "Hashing algorithm error: Unable to process the password.",
      );
      error.statusCode = 500;
      throw error;
    }

    const user = User({ name, email, password: hashedPassword });
    user
      .save()
      .then((user) => {
        res.status(200).json({
          message: "User Created Successfully",
          id: user._id.toString(),
        });
      })
      .catch((err) => {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      });
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        const error = new Error("User Not Found!");
        error.statusCode = 404;
        throw error;
      }

      bcrypt.compare(password, user.password, function (err, isValidPassword) {
        if (err) {
          const error = new Error(
            "Hashing algorithm error: Unable to process the password.",
          );
          error.statusCode = 500;
          return next(error);
        }

        if (!isValidPassword) {
          const error = new Error("Password Did not match!");
          error.statusCode = 500;
          return next(error);
        }

        const token = jwt.sign(
          { email: user.email, id: user._id.toString() },
          process.env.JWT_PRIVATE_kEY,
          { expiresIn: "1h" },
        );

        res.status(200).json({
          message: "Successfully logged in!",
          token,
          userId: user._id.toString(),
        });
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
