const path = require("path");

const { Router } = require("express");
const { rootPath } = require("../helper/rootPath");

const router = Router();

router.get("/", (req, res) => {
  res.sendFile(path.join(rootPath, "views", "home.html"));
});

exports.homeRoute = router;
