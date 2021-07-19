const bcrypt = require("bcrypt");
const { user } = require("../../models");
const { authError } = require("./errorhandling");

module.exports = async (req, res, next) => {
  const { username, password } = req.body;
  const userData = await user.findOne({ where: { username } });
  // eslint-disable-next-line new-cap
  if (!userData) throw new authError("Invalid Username.");
  const valid = await bcrypt.compare(password, userData.password);
  if (valid) {
    req.user = userData;
    next();
    /* eslint-disable-next-line new-cap */
  } else throw new authError("Invalid Password.");
};
