const { body } = require('express-validator');

module.exports.userValidation = [
  body('title')
    .isString()
    .length({ min: 5 })
    .withMessage('Should have minimum five characters.'),
  body('description')
    .isLength({ min: 10 })
    .withMessage('Should have minimum ten characters.'),
  body('body')
    .isLength({ min: 10 })
    .withMessage('Should have minimum ten characters.'),
  body('tagList').isArray().withMessage('Should be correct tag list.'),
];
