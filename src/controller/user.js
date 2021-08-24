const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const PasswordValidator = require('password-validator');
const { validationResult } = require('express-validator');
const { SignupError } = require('../middleware/errorhandling');
const response = require('../utils/response');
const {
  createUser,
  getUser,
  updateUser,
  userArticles,
} = require('../services/user');

const schema = new PasswordValidator();
schema.is().min(8).has().digits(1);

/**
 * Create new account.
 *
 * @param {express.Request} req -User information from a client.
 * @param {express.Response} res
 *
 * @return {Promise<object>} -User information's with token.
 */
async function signup(req, res) {
  const err = validationResult(req).errors;

  if (err.length) {
    throw new SignupError(`${err[0].msg}`);
  }
  const hashPassword = await bcrypt.hash(req.body.password, 10);
  req.body.password = hashPassword;
  const user = await createUser(req.body);
  if (!user) {
    throw new SignupError(`Invalid inputs.`);
  }
  const tokenObject = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  const JWT = jwt.sign(tokenObject, process.env.SECRET);
  user.dataValues.token = JWT;
  // Take the unique value from the error[string] that come from  database.
  // throw new SignupError(
  //   // Take the unique value from the error[string] that come from  database.
  //   `${e.errors[0].message.split(" ").shift()} already exist.`
  // );
  //   });
  res.status(200).json(response(200, user, 'Success!'));
}

/**
 * Basic authentication.
 *
 * @param {express.Request} req -Username & Password.
 * @param {express.Response} res
 *
 * @return {Promise<object>} -User information's with token.
 *
 */
async function login(req, res) {
  const { email, password } = req.body;
  const userData = await getUser(email);
  if (!userData) throw new SignupError('Invalid Email.');
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
    throw new SignupError('Invalid Password.');
  }
}

/**
 * Bearer authentication.
 *
 * @param {express.Request} req -Token.
 * @param {express.Response} res
 *
 * @return {Promise<object>} -User information's.
 *
 */
function bearerLogin(req, res) {
  res.status(200).json(response(200, req.user, 'success!'));
}

/**
 * Update user info depend on the request.
 *
 * @param {express.Request} req -Id, username, bio, email & password.
 * @param res
 * @return {Promise<object>}
 */
async function putUser(req, res) {
  const updating = updateUser(req.body, req.user.id);
  const token = getUser(req.user.id);
  res.json(response(200, token, 'success!'));
}

/**
 *To get articles that user created it.
 *
 * @param {express.Request} req -Token.
 * @param res
 * @return {Promise<object>}
 */
async function getUserArticles(req, res) {
  const data = await userArticles(req.user.id);
  res.json(response(200, data));
}

module.exports = { signup, login, bearerLogin, putUser, getUserArticles };
