const express = require("express");

const router = express.Router();
const basic = require("../middleware/basic");
const bearer = require("../middleware/bearer");
const { signup, login, bearerLogin } = require("../services/user");

router.post("/signup", signup);
router.post("/login", basic, login);
router.get("/token", bearer, bearerLogin);

module.exports = router;
