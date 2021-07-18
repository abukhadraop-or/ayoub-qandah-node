const jwt = require("jsonwebtoken");
const { user } = require("../../models");

// eslint-disable-next-line consistent-return
module.exports = async (req, res, next) => {
  const token = req.headers.authorization.split(" ").pop();
  const parsedToken = jwt.verify(token, process.env.SECRET);
  const userData = await user.findOne({
    where: { username: parsedToken.username },
  });
  if (user) {
    req.user = userData;
    next();
  } else {
    throw new Error("Invalid token");
  }
};
