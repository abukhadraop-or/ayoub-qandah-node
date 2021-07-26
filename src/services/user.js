const PasswordValidator = require("password-validator");
const validator = require("email-validator");
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
    throw new SignupError(
      "Your Password is Incorrect.",
      "Password must have digits and min length 8."
    );

  const User = await user
    .create({
      email,
      username,
      password,
      bio,
    })
    .catch((e) => {
      throw new SignupError(
        // Take the unique value from the error[string] that come from  database.
        `${e.errors[0].message.split(" ").shift()} already exist.`
      );
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

module.exports = { signup, login, bearerLogin };
