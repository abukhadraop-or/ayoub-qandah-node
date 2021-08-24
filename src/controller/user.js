const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const response = require('../utils/response');
const { Validation, DatabaseErr } = require('../middleware/error_handling');
const {
  getUser,
  createUser,
  updateUser,
  userArticles,
} = require('../services/user');

/**
 * Create new account.
 *
 * @param {express.Request}  req User information from a client.
 * @param {express.Response} res
 *
 * @return {object} User information's with token.
 */
async function signup(req, res) {
  const err = validationResult(req).errors;
  if (err.length) {
    throw new Validation(`${err[0].msg}`);
  }

  const hashPassword = await bcrypt.hash(req.body.password, 10);
  req.body.password = hashPassword;

  const user = await createUser(req.body);
  if (!user) {
    throw new DatabaseErr(`Error in inserting new user.`);
  }

  const tokenObject = {
    id: user.id,
    username: user.username,
    email: user.email,
  };
  const JWT = jwt.sign(tokenObject, process.env.SECRET);
  user.dataValues.token = JWT;

  res.status(200).json(response(200, user, 'Success!'));
}

/**
 * Basic authentication.
 *
 * @param {express.Request}  req Email & Password.
 * @param {express.Response} res
 *
 * @return {object} User information's with token.
 */
async function login(req, res) {
  const err = validationResult(req).errors;
  if (err.length) {
    throw new Validation(`${err[0].msg}`);
  }

  const { email, password } = req.body;

  const userData = await getUser(email);
  if (!userData) throw new Validation('Invalid Email.');

  const valid = await bcrypt.compare(password, userData.password);
  if (valid) {
    const tokenObject = {
      id: userData.id,
      username: userData.username,
      email: userData.email,
    };
    const JWT = jwt.sign(tokenObject, process.env.SECRET);
    userData.dataValues.token = JWT;

    res.status(200).json(response(200, userData, 'success!'));
  } else {
    throw new Validation('Invalid Password.');
  }
}

/**
 * Update user info depend on the request.
 *
 * @param {express.Request}  req Id, username, bio, email & password.
 * @param {express.Response} res
 *
 * @return {object} New user data.
 */
async function putUser(req, res) {
  const err = validationResult(req).errors;
  if (err.length) {
    throw new Validation(`${err[0].msg}`);
  }

  const updating = updateUser(req.body, req.user.id);
  if (!updating) {
    throw new DatabaseErr('Error in updating user.');
  }

  const token = getUser(req.user.id);
  if (!token) {
    throw new DatabaseErr('Error in getting user.');
  }

  res.json(response(200, token, 'success!'));
}

/**
 * Get articles that user created it.
 *
 * @param {express.Request} req Token.
 * @param {express.Request} res
 *
 * @return {object} Articles data.
 */
async function getUserArticles(req, res) {
  const data = await userArticles(req.user.id);
  if (!data) {
    throw Validation('Invalid user id.');
  }

  res.json(response(200, data));
}

module.exports = { signup, login, putUser, getUserArticles };
