const { Tag, User, Article, Comment } = require('../models');

/**
 * To insert new article.
 *
 * @param {object} values Title, description, body & tagList.
 *
 * @return {Promise<object>} Article data.
 */
const addArticle = (values) => {
  const createArticle = Article.create(values);
  return createArticle;
};

/**
 * To get all articles.
 *
 * @return {Promise<object>} Article data.
 */
const allArticles = () => {
  const allPosts = Article.findAndCountAll({
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
  });

  return allPosts;
};

/**
 * To insert new article.
 *
 * @param {object} values Title, description, body & tagList.
 *
 * @return {Promise<object>} Article data.
 */
const singleArticle = (id) => {
  const article = Article.findOne({
    where: { id },
    include: [
      { model: User, as: 'user', attributes: ['username'] },
      { model: Tag },
      {
        model: Comment,
        include: [{ model: User, as: 'user', attributes: ['username'] }],
      },
    ],
  });
  return article;
};

/**
 * To update specific article.
 *
 * @param {object} values Id, title, description, body & tagList.
 */
const updateArticle = (values) => {
  Article.update(values, { where: { id: values.id } });
};

/**
 * To remove specific article.
 *
 * @param {object} articleId Article id.
 */
const removeArticle = async (articleId) => {
  await Article.destroy({ where: { id: articleId } });
};

module.exports = {
  removeArticle,
  allArticles,
  addArticle,
  singleArticle,
  updateArticle,
};
