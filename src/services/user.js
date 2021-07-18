const { user } = require("../../models");

async function signup(req, res) {
  const { email, username, password, bio } = req.body;
  const User = await user.create({
    email,
    username,
    password,
    bio,
  });
  res.status(200).json({ data: User });
}

function login(req, res) {
  res.status(200).json({ code: 200, data: req.user });
}

function bearerLogin(req, res) {
  res.status(200).json({ code: 200, data: req.user });
}

module.exports = { signup, login, bearerLogin };
