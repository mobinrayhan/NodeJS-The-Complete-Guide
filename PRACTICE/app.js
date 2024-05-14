const path = require("node:path");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const shopRouter = require("./routes/shop");
const adminRouter = require("./routes/admin");

const { pageNotFound } = require("./model/error");

app.use("/admin", adminRouter);
app.use(shopRouter);

app.get("*", pageNotFound);

app.listen(3000);
