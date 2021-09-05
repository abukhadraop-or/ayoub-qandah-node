const { ArticleComment } = require('../models');

/**
 * To add comment in join table between article and comment.
 *
 * @param {number} articleId Article id.
 * @param {number} articleId Comment id.
 *
 * @return {Promise<Object>} ArticleId & CommentId.
 */
const addArticleComment = (articleId, commentId) =>
  ArticleComment.create({
    ArticleId: articleId,
    CommentId: commentId,
  });

module.exports = {
  addArticleComment,
};
