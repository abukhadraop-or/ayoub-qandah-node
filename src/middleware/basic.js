const bcrypt = require("bcrypt");
const { user } = require("../../models");
const { AuthError } = require("./errorhandling");

/**
 * Login by Username & Password (Basic Auth).
 *
 * @param {express.Request} req -Username,Password.
 * @param {express.Response} res
 * @param {express.NextFunction} next
 *
 * @return {Promise<object>} -User Information's.
 *
 */
module.exports = async (req, res, next) => {
  const { username, password } = req.body;
  const userData = await user.findOne({ where: { username } });
  if (!userData) throw new AuthError("Invalid Username.");
  const valid = await bcrypt.compare(password, userData.password);
  if (valid) {
    req.user = userData;
    next();
  } else throw new AuthError("Invalid Password.");
};
