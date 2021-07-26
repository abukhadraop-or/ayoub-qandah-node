const router = require("express-promise-router")();
const basic = require("../middleware/basic");
const bearer = require("../middleware/bearer");
const { signup, login, bearerLogin } = require("../services/user");

/**
 * User routes.
 */
router.post("/signup", signup);
router.post("/login", basic, login);
router.get("/token", bearer, bearerLogin);

module.exports = router;
