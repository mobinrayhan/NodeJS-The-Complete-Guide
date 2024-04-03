const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const router = require("./routes/shop");
const adminRoutes = require("./routes/admin");
const { get404 } = require("./controller/error");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes.routes);
app.use(router);

app.use("*", get404);

app.listen(3000);
