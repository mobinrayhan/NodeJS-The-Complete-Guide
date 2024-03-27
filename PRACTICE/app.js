const express = require("express");

const bodyParser = require("body-parser");
const { homeRouter } = require("./routes/home");
const { messageRoute } = require("./routes/message");
const { sendMessageRouter } = require("./routes/send-message");
const { pageNotFound } = require("./routes/404");
const { rootPath } = require("./helper/rootPath");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(sendMessageRouter);
app.use(messageRoute);
app.use(homeRouter);
app.use(pageNotFound);

app.listen(3000);
