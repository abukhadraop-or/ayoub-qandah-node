const jwt = require("jsonwebtoken");
const { user } = require("../../models");
const { AuthError } = require("./errorhandling");

/**
 * Login by token.
 * Check if the token valid.
 *
 * @param {express.Request} req -Token.
 * @param {express.Response} res
 * @param {express.NextFunction} next
 *
 * @return {Promise<object>} -User Information's (username,password,email).
 *
 */
module.exports = async (req, res, next) => {
  if (!req.headers.authorization) {
    throw new AuthError("There is no token.");
  }
  const token = req.headers.authorization.split(" ").pop();
  const parsedToken = jwt.verify(token, process.env.SECRET);
  const userData = await user.findOne({
    where: { username: parsedToken.username },
  });

  if (userData) {
    req.user = userData;
    next();
  } else {
    throw new AuthError("Invalid token.");
  }
};
