const { ArticleComment } = require('../models');

const removeArticleComment = async (articleId) => {
  await ArticleComment.destroy({ where: { ArticleId: articleId } });
};
const addArticleComment = async (articleId, commentId) => {
  const data = await ArticleComment.create({
    ArticleId: articleId,
    CommentId: commentId,
  });
  return data;
};

module.exports = {
  removeArticleComment,
  addArticleComment,
};
