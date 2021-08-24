const { User, Article, Comment } = require('../models');

/**
 * Inserting new user.
 *
 * @param {object} values Username,Email & Password.
 *
 * @returns {Promise<object>} user data.
 */
const createUser = async (values) => {
  const user = await User.create(values);
  return user;
};

/**
 * Get user.
 *
 * @param {number} email Email.
 *
 * @returns {Promise<object>} User data.
 */
const getUser = async (email) => {
  const user = await User.findOne({ where: { email } });
  return user;
};

/**
 * Update user depend on .
 *
 * @param {object} values Email, Username & Password.
 * @param {number} id     User id.
 *
 * @returns {Promise<object>} New user data.
 */
const updateUser = async (values, id) => {
  const user = await User.update(values, { where: { id } });
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
