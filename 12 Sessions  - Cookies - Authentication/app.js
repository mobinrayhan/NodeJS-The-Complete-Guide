const path = require("path");

const errorController = require("./controllers/error");

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const User = require("./models/user");
const bodyParser = require("body-parser");
const flash = require("connect-flash");

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

app.use((req, res, next) => {
  console.log(req.session.isLoggedIn);
  if (!req.session?.user?._id) {
    return next();
  }

  User.findById(req.session?.user._id)
    .then((user) => {
      req.user = user;
    })
    .catch((err) => console.log(err))
    .finally(() => {
      next();
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});
app.use(flash());

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(loginRoutes);

mongoose.connect(MONGODB_URI).then(() => {
  app.listen(3000);
});

app.use(errorController.get404);
