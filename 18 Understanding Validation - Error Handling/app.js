const path = require("path");

const errorController = require("./controllers/error");

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const User = require("./models/user");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const { doubleCsrf } = require("csrf-csrf");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const MONGODB_URI = `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_PASSWORD}@nodejs1.gl4wmlm.mongodb.net/shop?retryWrites=true&w=majority&appName=NodeJs1`;
const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const loginRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

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
  cookieName: "-psifi.x-csrf-token",
  cookieOptions: {
    sameSite: "lax",
    path: "/",
    secure: true,
  },
  size: 32, // The size of the generated tokens in bits
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  getTokenFromRequest: (req) => req.body._csrf || req.headers["x-csrf-token"],
});

app.use(cookieParser());
app.use(doubleCsrfProtection);

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
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use(flash());

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(loginRoutes);

app.get("/500", errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
  res.render("errors/500", {
    pageTitle: "Something went wrong!",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose.connect(MONGODB_URI).then(() => {
  app.listen(3000);
});
