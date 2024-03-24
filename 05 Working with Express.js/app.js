const path = require("path");

const express = require("express");

const { rootPath } = require("./helper/rootPath");

const { usersRouter } = require("./routes/users");
const { homeRoute } = require("./routes/home");

const app = express();

app.use(homeRoute);
app.use(usersRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(rootPath, "views", "404.html"));
});

app.listen(3000);
