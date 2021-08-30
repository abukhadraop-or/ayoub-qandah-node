const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const response = require('../utils/response');
const { Authentication } = require('../middleware/error-handler');
const {
  getUser,
  createUser,
  updateUser,
  userArticles,
} = require('../services/user');

/**
 * Create new account.
 *
 * @param {express.Request}  req Username, Email & password.
 * @param {express.Response} res
 *
 * @return {Object} Username, Email & Token.
 */
async function signup(req, res) {
  const hashPassword = await bcrypt.hash(req.body.password, 10);
  req.body.password = hashPassword;

  const user = await createUser(req.body);

  const tokenObject = {
    id: user.id,
    username: user.username,
    email: user.email,
  };
  const JWT = jwt.sign(tokenObject, process.env.SECRET);
  user.token = JWT;

  res.json(response(user));
}

/**
 * Basic authentication.
 *
 * @param {express.Request}  req Email & Password.
 * @param {express.Response} res
 *
 * @return {Object} User information's with token.
 */
async function login(req, res) {
  const { email, password } = req.body;

  const userData = await getUser(email);
  if (!userData) throw new Authentication('Invalid Email.');

  const valid = await bcrypt.compare(password, userData.password);
  if (valid) {
    const tokenObject = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
    };
    const JWT = jwt.sign(tokenObject, process.env.SECRET);
    userData.dataValues.token = JWT;

    res.json(response(userData));
  } else {
    throw new Authentication('Invalid Password.');
  }
}

/**
 * Update user info depend on the request.
 *
 * @param {express.Request}  req Id, username, bio, email & password.
 * @param {express.Response} res
 *
 * @return {Object} New user data.
 */
async function putUser(req, res) {
  const [row, data] = await updateUser(req.body, req.user.id);
  res.json(response([row, ...data]));
}

/**
 * Get articles that user created it.
 *
 * @param {express.Request} req Token.
 * @param {express.Request} res
 *
 * @return {Object} Articles data.
 */
async function getUserArticles(req, res) {
  const data = await userArticles(req.user.id);

  res.json(response(data));
}

module.exports = { signup, login, putUser, getUserArticles };
