const passwordValidator = require("password-validator");
const util = require("util");
const validator = require("email-validator");
const { user } = require("../../models");
const { signupError } = require("../middleware/errorhandling");
const response = require("../utils/response");
// eslint-disable-next-line new-cap
const schema = new passwordValidator();
schema.is().min(8).has().digits(1);

async function signup(req, res) {
  const { email, username, password, bio } = req.body;
  // eslint-disable-next-line new-cap
  if (!validator.validate(email)) throw new signupError("Incorrect Email.");
  if (!schema.validate(password))
    // eslint-disable-next-line new-cap
    throw new signupError(
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
      // eslint-disable-next-line new-cap
      throw new signupError(
        // Take the unique value from the error[string] that come from  database.
        `${e.errors[0].message.split(" ").shift()} already exist.`
      );
    });

  res.status(200).json(response(200, User, "Success!"));
}

function login(req, res) {
  res.status(200).json(response(200, req.user, "success!"));
}

function bearerLogin(req, res) {
  res.status(200).json(response(200, req.user, "success!"));
}

module.exports = { signup, login, bearerLogin };
