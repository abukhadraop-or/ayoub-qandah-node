const { User, Comment } = require('../models');
const { getArray } = require('../utils/get-array');

/**
 * Inserting new comment.
 *
 * @param {Object} values Body, articleId & userId.
 *
 * @returns {Promise<Object>} Created comment data.
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
 * @param {number} values id.
 * @param {Object} values Body, articleId & userId.
 *
 * @returns {Promise<[number, Object[]]>} Created comment data.
 */
const updateComment = async (id, values) => {
  const data = await Comment.update(values, { where: { id }, returning: true });
  return data.dataValues;
};

/**
 * Get single comment.
 *
 * @param {number} id Comment id.
 *
 * @returns {Promise<Object>} comment data.
 */
const singleComment = async (id) => {
  const comment = await Comment.findOne({ where: { id } });
  return comment.dataValues;
};

/**
 * Deleting  comment.
 *
 * @param {number} id Comment id.
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
