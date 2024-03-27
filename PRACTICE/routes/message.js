const { Router } = require("express");
const { writeFileSync } = require("fs");
const path = require("path");
const { rootPath } = require("../helper/rootPath");

const router = Router();

router.post("/message", (req, res, next) => {
  writeFileSync("message.txt", req.body.message);
  res.sendFile(path.join(rootPath, "views", "message.html"));
});

exports.messageRoute = router;
