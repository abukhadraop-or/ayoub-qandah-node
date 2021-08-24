const {
  Tag,
  User,
  Article,
  Comment,
  ArticleTag,
  ArticleComment,
} = require('../models');
const { ArticleError, InvalidValues } = require('../middleware/errorhandling');

const addArticle = async (values) => {
  const createArticle = await Article.create(values).catch((e) => {
    throw new ArticleError('Error in values data type or name of fields.');
  });

  return createArticle;
};

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
  }).catch((e) => {
    throw new ArticleError(`Error finding the articles from database:- ${e}`);
  });
  return allPosts;
};

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
const updateArticle = async (values) => {
  await Article.update(values, { where: { id: values.id } });
};

const removeArticle = async (articleId, userId) => {
  await Article.destroy({ where: { id: articleId } });
};

module.exports = {
  removeArticle,
  allArticles,
  addArticle,
  singleArticle,
  updateArticle,
};
