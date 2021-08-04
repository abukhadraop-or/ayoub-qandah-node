const PasswordValidator = require("password-validator");
const validator = require("email-validator");
const { where } = require("sequelize");
const { user } = require("../../models");
const { SignupError } = require("../middleware/errorhandling");
const response = require("../utils/response");

const schema = new PasswordValidator();
schema.is().min(8).has().digits(1);

/**
 * Create new account.
 *
 * @param {express.Request} req -User information from a client.
 * @param {express.Response} res
 *
 * @return {Promise<object>} -User information's with token.
 *
 */
async function signup(req, res) {
  const { email, username, password, bio } = req.body;
  if (!validator.validate(email)) throw new SignupError("Incorrect Email.");

  if (!schema.validate(password))
    res
      .status(501)
      .json({ msg: "Password must have digits and min length 8." });
  // throw new SignupError(
  //   "Your Password is Incorrect.",
  //   "Password must have digits and min length 8."
  // ).msg;

  const User = await user
    .create({
      email,
      username,
      password,
      bio,
    })
    .catch((e) => {
      // Take the unique value from the error[string] that come from  database.
      res.status(501).json({
        msg: `${e.errors[0].message.split(" ").shift()} already exist.`,
      });
      // throw new SignupError(
      //   // Take the unique value from the error[string] that come from  database.
      //   `${e.errors[0].message.split(" ").shift()} already exist.`
      // ).msg;
    });

  res.status(200).json(response(200, User, "Success!"));
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
function login(req, res) {
  res.status(200).json(response(200, req.user, "success!"));
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
  res.status(200).json(response(200, req.user, "success!"));
}

/**
 * Update user info depend on the request.
 *
 * @param {express.Request} req -Id, username, bio, email & password.
 * @param res
 * @return {Promise<object>}
 */
async function updateUser(req, res) {
  const { id, username, bio, email, password } = req.body;
  const obj = {};
  if (username) obj.username = username;
  if (bio) obj.bio = bio;
  if (password) obj.password = password;
  if (email) obj.email = email;
  await user.update(obj, { where: { id } }).catch((e) => {
    res.status(501).json(response(501, null, e));
  });
  res.json({ msg: "sucsess!" });
}

module.exports = { signup, login, bearerLogin, updateUser };
