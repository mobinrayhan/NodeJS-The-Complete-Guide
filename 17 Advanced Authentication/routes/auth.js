const express = require("express");
const {
  getLogin,
  postLogin,
  postLogout,
  getSignUp,
  postSignUp,
  getReset,
  postReset,
  getNewPassword,
  postNewPassword,
} = require("../controllers/auth");

const router = express.Router();

router.get("/login", getLogin);
router.post("/login", postLogin);

router.post("/logout", postLogout);

router.get("/signup", getSignUp);
router.post("/signup", postSignUp);

router.get("/reset", getReset);
router.post("/reset", postReset);

router.get("/reset/:token", getNewPassword);
router.post("/update-password", postNewPassword);

module.exports = router;