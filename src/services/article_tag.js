const { ArticleTag } = require('../models');

const articleTag = async (values) => {
  const data = await ArticleTag.bulkCreate(values);
  return data;
};

const removeArticleTag = async (articleId) => {
  await ArticleTag.destroy({ where: { ArticleId: articleId } });
};

module.exports = { removeArticleTag, articleTag };
