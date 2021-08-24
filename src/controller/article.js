const { validationResult } = require('express-validator');
const { InvalidValues } = require('../middleware/errorhandling');
const {
  addArticle,
  allArticles,
  singleArticle,
  removeArticle,
  updateArticle,
} = require('../services/article');
const { removeArticleComment } = require('../services/article_comment');
const { articleTag, removeArticleTag } = require('../services/article_tag');
const { allTags, createTags } = require('../services/tag');
const response = require('../utils/response');

/**
 * Create new article.
 * Check if the user id is invalid.
 * Make association between article & comment.
 * Make association between article & user that's added an article.
 *
 * @param {express.Request} req -Body,slug,title,userId,tag_list,favorited,description & favorites_count.
 * @param {express.Response} res
 *
 * @return {Promise<object>} -Article information's.
 */
async function postArticle(req, res) {
  const err = validationResult(req).errors;
  if (err.length) {
    throw new InvalidValues(`${err[0].msg}`);
  }
  req.body.userId = req.user.id;
  const article = await addArticle(req.body);
  const tags = await allTags();
  const filterTags = [];
  const articleTagsId = [];
  let tagsArr;
  if (tags.length) {
    tagsArr = tags.map((e) => e.dataValues.tags);
  } else {
    tagsArr = [];
  }

  const inputTags = article.dataValues.tagList;
  for (let x = 0; x < inputTags.length; x += 1) {
    if (!tagsArr.includes(inputTags[x])) {
      filterTags.push({ tags: inputTags[x] });
    } else {
      articleTagsId.push({
        TagId: tags[tagsArr.indexOf(inputTags[x])].dataValues.id,
        ArticleId: article.dataValues.id,
      });
    }
  }
  if (filterTags.length) {
    const addTags = await createTags(filterTags);
    for (let x = 0; x < addTags.length; x += 1) {
      articleTagsId.push({
        TagId: tags[x].dataValues.id,
        ArticleId: article.dataValues.id,
      });
    }
  }
  const joinTable = await articleTag(articleTagsId);

  res.status(200).json(response(200, article, 'Article created.'));
}

/**
 * Get all articles with all associations.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 *
 * @return {Promise<object>} -Articles information.
 *
 */
async function getArticles(req, res) {
  const data = await allArticles();

  res.status(200).json(response(200, data, 'success!'));
}

/**
 * Get single article with all associations.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 *
 * @return {Promise<object>} -Article information.
 *
 */
async function getSingleArticle(req, res) {
  const { id } = req.params;
  const data = await singleArticle(id);
  if (!data) {
    throw new InvalidValues('Invalid article id.');
  }
  res.status(200).json(response(200, data, 'success!'));
}

/**
 * Update article by uuid.
 * Check if the user have access to update this article.
 * Update join table to new updating values.
 *
 * @param {express.Request} req -Slug, title, description, body, tag_list, uuid, userId
 * @param {express.Response} res
 *
 * @return {Promise<object>} -Article information after updating.
 *
 */
async function putArticle(req, res) {
  let article = singleArticle(req.body.id);
  if (!article) {
    throw new InvalidValues('Invalid article id.');
  }
  if (article.userId !== req.user.id) {
    throw new InvalidValues(
      'You do not have an access to update this article.'
    );
  }
  req.body.userId = req.user.id;
  const data = await updateArticle(req.body);
  article = singleArticle(req.body.id);

  res.status(200).json(response(200, article, 'Article updated.'));
}

/**
 * Delete article by uuid.
 * Check if the user have access to delete this article.
 * Update join table to new updating values.
 *
 * @param {express.Request} req -Slug, title, description, body, tag_list, uuid, userId
 * @param {express.Response} res
 *
 * @return {Promise<string>} -Success message.
 *
 */
function deleteArticle(req, res) {
  const { articleId } = req.params;
  const article = singleArticle(articleId);
  if (!article) {
    throw new InvalidValues('Invalid article id.');
  }
  if (req.user.id !== article.userId) {
    throw new InvalidValues(
      'You do not have an access to update this article.'
    );
  }

  removeArticle(articleId);
  removeArticleTag(articleId);
  removeArticleComment(articleId);

  res.status(200).json(response(200, null, 'Article Deleted!'));
}

module.exports = {
  postArticle,
  getArticles,
  getSingleArticle,
  putArticle,
  deleteArticle,
};
