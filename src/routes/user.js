const express = require("express");

const { user } = require("../../models");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello");
});
router.post("/signup", async (req, res) => {
  const { email, username, password, bio } = req.body;
  const User = await user.create({
    email,
    username,
    password,
    bio,
  });
  res.status(200).json({data:User});
});

// router.get("/getuser", async (req, res) => {
//   const User = await user.findAll();
//   res.json(User);
// });
// eslint-disable-next-line consistent-return

module.exports = router;
