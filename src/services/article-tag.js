const { ArticleTag } = require('../models');

/**
 * To add multi or single tag in ArticleTag join table.
 *
 * @param {object} articleId ArticleId & TagId.
 *
 * @return {Promise<Array>} ArticleId & TagId.
 */
const articleTag = (values) => {
  const data = ArticleTag.bulkCreate(values);
  return data;
};
/**
 * To remove  article tags from ArticleTag join table.
 *
 * @param {number} articleId ArticleId.
 */
const removeArticleTag = (articleId) => {
  ArticleTag.destroy({ where: { ArticleId: articleId } });
};

module.exports = { removeArticleTag, articleTag };
