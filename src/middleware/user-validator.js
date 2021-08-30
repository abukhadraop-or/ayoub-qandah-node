const { body, validationResult } = require('express-validator');
const { Validation } = require('./error-handler');

/**
 * Check input validation.
 */
module.exports.userValidation = [
  body('email').isEmail().withMessage('Should be correct email.'),

  body('username')
    .isLength({ min: 5 })
    .withMessage('Username should have minimum five characters.'),

  body('password')
    .isLength({ min: 8 })
    .matches(/\d/)
    .withMessage('Password should have one digit at least.'),

  (req, res, next) => {
    const err = validationResult(req).errors;
    if (err.length) {
      if (err.length > 3) throw new Validation('There is additional field.');
      if (req.method === 'PUT') {
        err.forEach((e) => {
          if (e.param in req.body) throw new Validation(e.msg);
        });

        if (req.body.id) {
          throw new Validation('Invalid input data.');
        }
        next();
      } else {
        throw new Validation(`${err[0].msg}`);
      }
    }
  },
];
