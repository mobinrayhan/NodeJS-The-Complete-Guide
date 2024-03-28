const express = require("express");
const path = require("path");

const bodyParser = require("body-parser");

const { rootPath } = require("./helper/rootPath");

const { homeRouter } = require("./routes/home");
const { messageRoute } = require("./routes/message");
const { sendMessageRouter } = require("./routes/send-message");
const { pageNotFound } = require("./routes/404");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(rootPath, "public")));

const pug = require("pug");
app.set("view engine", "pug");

app.use(sendMessageRouter);
app.use(messageRoute);
app.use(homeRouter);
app.use(pageNotFound);

app.listen(3000);
