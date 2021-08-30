const { ArticleTag } = require('../models');

/**
 * To add multi or single tag in ArticleTag join table.
 *
 * @param {Object} values ArticleId & TagId.
 *
 * @return {Promise<Array>} ArticleId & TagId.
 */
const articleTag = (values) => {
  const data = ArticleTag.bulkCreate(values);
  return data;
};

module.exports = { articleTag };
