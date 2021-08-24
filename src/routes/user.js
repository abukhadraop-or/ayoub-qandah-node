const router = require('express-promise-router')();
const bearer = require('../middleware/bearer');
const {
  login,
  signup,
  putUser,
  bearerLogin,
  getUserArticles,
} = require('../controller/user');
const { userValidation } = require('../middleware/user_validator');

/**
 * User routes.
 */
router.post('/login', login);
router.put('/update', bearer, putUser);
router.get('/token', bearer, bearerLogin);
router.post('/signup', userValidation, signup);
router.get('/user/articles', bearer, getUserArticles);

module.exports = router;
