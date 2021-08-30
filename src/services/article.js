const { Tag, User, Article, Comment } = require('../models');
const { getArray } = require('../utils/get-array');

/**
 * To insert new article.
 *
 * @param {Object} values Title, description, body & tagList.
 *
 * @return {Promise<Object>} Article data(without any association).
 */
const addArticle = async (values) => {
  const createArticle = await Article.create(values);
  return createArticle.dataValues;
};

/**
 * To get all articles.
 *
 * @return {Promise<Array>} Articles data (User:username,Comment:[],Tag:[]).
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
 * To get single article by id.
 *
 * @param {id} values Id.
 *
 * @return {Promise<Object>} Article data (User:username,Comment:[],Tag:[]).
 */
const singleArticle = async (id) => {
  const { dataValues } = await Article.findOne({
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
  return dataValues;
};

/**
 * To update specific article.
 *
 * @param {number} id     Id.
 * @param {Object} values Title, description, body & tagList.
 *
 * @return {Promise<[number, Object[]]>}
 */
const updateArticle = async (id, values) => {
  const data = await Article.update(values, { where: { id }, returning: true });
  return data;
};

/**
 * To remove specific article.
 *
 * @param {Object} articleId Article id.
 */
const removeArticle = async (articleId) => {
  await Article.destroy({ where: { id: articleId } });
};

module.exports = {
  addArticle,
  allArticles,
  removeArticle,
  singleArticle,
  updateArticle,
};
