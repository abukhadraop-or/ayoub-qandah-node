const { Tag, User, Article, Comment } = require('../models');
const { getArray } = require('../utils/get-array');

/**
 * To insert new article.
 *
 * @param {object} values Title, description, body & tagList.
 *
 * @return {Promise<object>} Article data.
 */
const addArticle = async (values) => {
  const createArticle = await Article.create(values);
  return createArticle.dataValues;
};

/**
 * To get all articles.
 *
 * @return {Promise<object>} Article data.
 */
const allArticles = async () => {
  const allPosts = await Article.findAndCountAll({
    include: [
      { model: User, as: 'user', attributes: ['username'] },
      {
        model: Comment,
        attributes: ['id', 'body', 'createdAt'],
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['username'],
          },
        ],
      },
      {
        model: Tag,
        attributes: ['name'],
      },
    ],
  });

  return getArray(allPosts.rows);
};

/**
 * To insert new article.
 *
 * @param {object} values Title, description, body & tagList.
 *
 * @return {Promise<object>} Article data.
 */
const singleArticle = async (id) => {
  const article = await Article.findOne({
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
  return article.dataValues;
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
