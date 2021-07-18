const bcrypt = require("bcrypt");
const { user } = require("../../models");

module.exports = async (req, res, next) => {
  const { username, password } = req.body;
  const userData = await user.findOne({ where: { username } });

  const valid = await bcrypt.compare(password, userData.password);
  if (valid) {
    req.user = userData;
    next();
  } else {
    throw new Error("Invalid Username or Password");
  }
};
