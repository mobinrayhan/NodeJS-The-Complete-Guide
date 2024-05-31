const path = require("path");

const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const bodyParser = require("body-parser");

const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const User = require("./models/user");

app.use((req, res, next) => {
  User.findById("6658458cac7a22e7b26c4669")
    .then((user) => {
      req.user = user;
    })
    .catch((err) => console.log(err))
    .finally(() => {
      next();
    });
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

const uri = `mongodb+srv://${process.env.MONGODB_USER_NAME}:${process.env.MONGODB_PASSWORD}@nodejs1.gl4wmlm.mongodb.net/shop?retryWrites=true&w=majority&appName=NodeJs1`;
mongoose.connect(uri).then(() => {
  User.findById("6658458cac7a22e7b26c4669").then((user) => {
    if (!user) {
      new User({
        name: "Mobin",
        email: "sdm241405@gmail.com",
        cart: { items: [] },
      }).save();
    }
  });
  app.listen(3000);
});
app.use(errorController.get404);
