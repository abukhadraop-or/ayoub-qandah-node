const { User, Article, Comment } = require('../models');

/**
 * Inserting new user.
 *
 * @param {Object} values Username,email & password.
 *
 * @returns {Promise<Object>} Username, Email.
 */
const createUser = async (values) => {
  const user = await User.create(values);
  return user.dataValues;
};

/**
 * Get user.
 *
 * @param {String} email Email.
 *
 * @returns {Promise<Object>} Email, username, id & token.
 */
const getUser = async (email) => {
  const user = await User.findOne({ where: { email } });
  return user;
};

/**
 * Update user depend on request.
 *
 * @param {Object} values Email, Username & Password.
 * @param {number} id     User id.
 *
 * @returns {Promise<[number, Object[]]>} Updated user data.
 */
const updateUser = async (values, id) => {
  const user = await User.update(values, { where: { id }, returning: true });
  return user;
};

/**
 * Get Articles for user.
 *
 * @param {number} id User id.
 *
 * @returns {Promise<Array>} Articles data & comments.
 */
const userArticles = async (id) => {
  const data = await User.findOne({
    where: { id },
    include: [
      {
        model: Article,
        include: [
          { model: User, as: 'user', attributes: ['username'] },
          {
            model: Comment,
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['username'],
              },
            ],
          },
        ],
      },
    ],
  });
  return data;
};

module.exports = { userArticles, createUser, getUser, updateUser };
