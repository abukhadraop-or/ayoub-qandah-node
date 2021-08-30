const { body, validationResult, checkSchema } = require('express-validator');
const { Validation } = require('./error-handler');

/**
 * Check input validation.
 */
module.exports.articleValidator = [
  body('title')
    .isString()
    .isLength({ min: 5 })
    .withMessage('Should have minimum five characters.'),

  body('description')
    .isLength({ min: 10 })
    .withMessage('Should have minimum ten characters.'),

  body('body')
    .isLength({ min: 10 })
    .withMessage('Should have minimum ten characters.'),

  body('tagList').isArray().withMessage('Should be correct tag list.'),

  (req, res, next) => {
    if (Object.values(req.body).length > 4) {
      throw new Validation(`There is additional value.`);
    }
    const err = validationResult(req).errors;
    if (err.length) {
      throw new Validation(`${err[err.length - 1].msg}`);
    }
    next();
  },
];
