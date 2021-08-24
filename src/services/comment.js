const { User, Comment } = require('../models');

/**
 * Inserting new comment.
 *
 * @param {object} values Body, articleId & userId.
 *
 * @returns {Promise<object>} Created comment data.
 */
const addComment = async (values) => {
  const createComment = await Comment.create(values);
  return createComment;
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
  return Comments;
};

/**
 * Updating  comment.
 *
 * @param {object} values Body, articleId & userId.
 *
 * @returns {Promise<object>} Created comment data.
 */
const updateComment = async (values) => {
  const comment = await Comment.update(values, { where: { id: values.id } });
  return comment;
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
  return comment;
};

/**
 * Deleting  comment.
 *
 * @param {number} id Comment id.
 *
 * @returns {Promise<Array>} Empty array.
 */
const removeComment = async (id) => {
  const comment = await Comment.destroy({ where: { id } });
  return comment;
};

module.exports = {
  addComment,
  allComments,
  singleComment,
  removeComment,
  updateComment,
};
