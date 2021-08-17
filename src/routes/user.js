const router = require("express-promise-router")();
const basic = require("../middleware/basic");
const bearer = require("../middleware/bearer");
const {
  signup,
  login,
  bearerLogin,
  updateUser,
  userArticles,
} = require("../services/user");

/**
 * User routes.
 */
router.post("/signup", signup);
router.post("/login", basic, login);
router.put("/update", bearer, updateUser);
router.get("/token", bearer, bearerLogin);
router.get("/user/articles", bearer, userArticles);

module.exports = router;
