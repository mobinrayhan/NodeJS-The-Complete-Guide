const path = require("path");

const { Router } = require("express");

const route = Router();

// route.get("/", (req, res, next) => {
//   res.write("<h1>Hello From Express.js</h1>");
// });

route.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "../", "views", "shop.html"));
});

module.exports = route;
