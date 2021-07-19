const jwt = require("jsonwebtoken");
const { user } = require("../../models");
const { authError } = require("./errorhandling");

module.exports = async (req, res, next) => {
  console.log(req.headers.authorization)
  if (!req.headers.authorization) {
    throw new authError("There is no token."); // eslint-disable-line new-cap
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
    throw new authError("Invalid token."); // eslint-disable-line new-cap
  }
};
