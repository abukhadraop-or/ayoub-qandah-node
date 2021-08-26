const { body } = require('express-validator');

/**
 * Check input validation.
 */
module.exports.userValidation = [
  body('email').isEmail().withMessage('Should be correct email.'),
  body('username')
    .isLength({ min: 5 })
    .withMessage('Should have minimum five characters.'),
  body('password')
    .isLength({ min: 8 })
    .matches(/\d/)
    .withMessage('Should have one digit at least.'),
];
