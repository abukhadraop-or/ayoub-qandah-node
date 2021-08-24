const router = require('express-promise-router')();
const bearer = require('../middleware/bearer');
const {
  login,
  signup,
  putUser,
  getUserArticles,
} = require('../controller/user');
const { userValidation } = require('../middleware/user_validator');

/**
 * User routes.
 */
router.post('/login', userValidation, login);
router.post('/signup', userValidation, signup);
router.get('/user/articles', bearer, getUserArticles);
router.put('/update', userValidation, bearer, putUser);

module.exports = router;
