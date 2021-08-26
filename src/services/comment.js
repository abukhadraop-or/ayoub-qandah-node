const { User, Comment } = require('../models');
const { getArray } = require('../utils/get-array');

/**
 * Inserting new comment.
 *
 * @param {object} values Body, articleId & userId.
 *
 * @returns {Promise<object>} Created comment data.
 */
const addComment = async (values) => {
  const createComment = await Comment.create(values);
  return createComment.dataValues;
};

/**
 * Get all comment.
 *
 * @returns {Promise<Array>} Comments data.
 */
const allComments = async () => {
  const Comments = await Comment.findAll({
    include: [{ model: User, as: 'user' }],
  });
  return getArray(Comments);
};

/**
 * Updating  comment.
 *
 * @param {object} values Body, articleId & userId.
 *
 * @returns {Promise<object>} Created comment data.
 */
const updateComment = (values) => {
  Comment.update(values, { where: { id: values.id } });
};

/**
 * Get single comment.
 *
 * @param {number} id Comment id.
 *
 * @returns {Promise<object>} comment data.
 */
const singleComment = async (id) => {
  const comment = await Comment.findOne({ where: { id } });
  return comment.dataValues;
};

/**
 * Deleting  comment.
 *
 * @param {number} id Comment id.
 *
 * @returns {Promise<Array>} Empty array.
 */
const removeComment = async (id) => {
  await Comment.destroy({ where: { id } });
};

module.exports = {
  addComment,
  allComments,
  singleComment,
  removeComment,
  updateComment,
};
