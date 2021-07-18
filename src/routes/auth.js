const express = require("express");

const router = express.Router();
const basic = require("../middleware/basic");
const bearer = require("../middleware/bearer");

router.post("/login", basic, (req, res) => {
  res.status(200).json({ code: 200, data: req.user });
});

router.get("/token", bearer, (req, res) => {
  res.status(200).json({ code: 200, data: req.user });
});
module.exports = router;
