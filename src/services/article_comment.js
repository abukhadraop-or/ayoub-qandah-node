const { ArticleComment } = require('../models');
/**
 * To remove comment from join table between article and comment.
 *
 * @param {number} articleId Article id.
 */
const removeArticleComment = (articleId) => {
  ArticleComment.destroy({
    where: { ArticleId: articleId },
  });
};

/**
 * To add comment in join table between article and comment.
 *
 * @param {number} articleId Article id.
 * @param {number} articleId Comment id.
 *
 * @return {Promise<object>} ArticleId & CommentId.
 */
const addArticleComment = (articleId, commentId) => {
  const data = ArticleComment.create({
    ArticleId: articleId,
    CommentId: commentId,
  });
  return data;
};

module.exports = {
  addArticleComment,
  removeArticleComment,
};
