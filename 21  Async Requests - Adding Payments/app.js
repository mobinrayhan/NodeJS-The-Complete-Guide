const path = require("path");

const errorController = require("./controllers/error");

const express = require("express");
const app = express();

const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const User = require("./models/user");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const { doubleCsrf } = require("csrf-csrf");
const cookieParser = require("cookie-parser");
const shopController = require("./controllers/shop");
const { userAuth } = require("./middleware/is-auth");

const multer = require("multer");

require("dotenv").config();

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_PASSWORD}@nodejs1.gl4wmlm.mongodb.net/shop?retryWrites=true&w=majority&appName=NodeJs1`;

const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = crypto.randomUUID();
    cb(null, "MOBIN-" + uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = function (req, file, callback) {
  const ext = file.mimetype;

  if (ext === "image/png" || ext === "image/jpg" || ext === "image/jpeg") {
    return callback(null, true);
  } else {
    callback(null, false);
  }
};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: storage, fileFilter }).single("image"));
// app.use(multer({ dest: "images/" }).single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(
  session({
    secret: "My Secret",
    resave: false,
    saveUninitialized: false,
    store,
  }),
);

const { doubleCsrfProtection } = doubleCsrf({
  getSecret: () => "My Secret", // Retrieve the secret from environment variable
  cookieName: "psifi.x-csrf-token",
  cookieOptions: {
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV !== "development",
  },
  size: 32, // The size of the generated tokens in bits
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  // getTokenFromRequest: (req) => req.body._csrf || req.headers["x-csrf-token"],

  getTokenFromRequest: (req) => {
    if (
      req.is("application/x-www-form-urlencoded") ||
      req.is("multipart/form-data") ||
      req.get("Content-Type").includes("form")
    ) {
      return req.body._csrf;
    }

    return req.headers["x-csrf-token"];
  },
});

app.use(cookieParser());

app.use((req, res, next) => {
  if (!req.session?.user?._id) {
    return next();
  }

  User.findById(req.session?.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }

      req.user = user;
    })
    .catch((err) => next(new Error(err)))
    .finally(() => {
      next();
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});
app.use(flash());

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const loginRoutes = require("./routes/auth");

app.post("/create-order", userAuth, shopController.postOrder);

app.use(doubleCsrfProtection);
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(loginRoutes);

app.get("/500", errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  // console.log(error, "From ERROR middleware");
  // res.redirect("/500");

  console.log(error, "Error IN ERROR middleware");

  console.log(res.locals.csrfToken, "FROM APP.js");

  res.render("errors/500", {
    pageTitle: "Something went wrong!",
    path: "/500",
    isAuthenticated: req.session?.isLoggedIn,
  });
});

mongoose.connect(MONGODB_URI).then(() => {
  app.listen(3000);
});
