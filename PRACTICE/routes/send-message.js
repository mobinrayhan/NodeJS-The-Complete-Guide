const { Router } = require("express");
const path = require("path");
const { rootPath } = require("../helper/rootPath");

const router = Router();

router.get("/send-message", (req, res, next) => {
  res.sendFile(path.join(rootPath, "views", "send.html"));
});

exports.sendMessageRouter = router;
