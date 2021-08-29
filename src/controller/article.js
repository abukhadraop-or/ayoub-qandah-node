const { validationResult } = require('express-validator');
const { Validation, NotFound } = require('../middleware/error-handler');
const {
  addArticle,
  allArticles,
  singleArticle,
  removeArticle,
  updateArticle,
} = require('../services/article');
// const { removeArticleComment } = require('../services/article-comment');
const { articleTag } = require('../services/article-tag'); //removeArticleTag
const { createTags, includesTag } = require('../services/tag');
const response = require('../utils/response');

/**
 * Create new article.
 * Check if the user id is invalid.
 * Make association between article & comment.
 * Make association between article & user that's added an article.
 *
 * @param {express.Request}  req Body,slug,title,userId,tag_list,favorited,description & favorites_count.
 * @param {express.Response} res
 *
 * @return {object} Article information's.
 */
async function postArticle(req, res) {
  const err = validationResult(req).errors;
  if (err.length) {
    throw new Validation(`${err[0].msg}`);
  }

  const { tagList, ...articleBody } = req.body;
  articleBody.userId = req.user.id;

  const dbArticle = await addArticle(articleBody);
  const dbTags = await includesTag(tagList);

  const newTags = [];
  const exisitingTags = [];
  tagList.forEach((tag) => {
    const dbTag = dbTags.find((t) => t.name === tag);
    (dbTag ? exisitingTags : newTags).push(dbTag || { name: tag });
  });

  let addTags = [];
  if (newTags.length) {
    addTags = await createTags(newTags);
  }

  await articleTag(
    [...exisitingTags, ...addTags].map((t) => ({
      TagId: t.id,
      ArticleId: dbArticle.id,
    }))
  );

  res.status(200).json(response(200, dbArticle, 'Article created.'));
}

/**
 * Get all articles with all associations.
 *
 * @param {express.Request}  req
 * @param {express.Response} res
 *
 * @return {object} Articles information.
 */
async function getArticles(req, res) {
  const data = await allArticles();

  res.json(response(data));
}

/**
 * Get single article with all associations.
 *
 * @param {express.Request}  req
 * @param {express.Response} res
 *
 * @return {object} Article information.
 */
async function getSingleArticle(req, res) {
  const { id } = req.params;
  const data = await singleArticle(id);

  if (!data) {
    throw new NotFound('');
  }

  res.json(response(data));
}

/**
 * Update article by uuid.
 * Check if the user have access to update this article.
 * Update join table to new updating values.
 *
 * @param {express.Request}  req Slug, title, description, body, tag_list, uuid, userId.
 * @param {express.Response} res
 *
 * @return {object} Article information after updating.
 */
async function putArticle(req, res) {
  const { id } = req.params;

  const article = singleArticle(id);

  if (!article) {
    throw new NotFound('');
  }

  if (article.userId !== req.user.id) {
    throw new NotFound('');
  }

  const [ro, data] = await updateArticle(id, req.body);

  res.json(response(data));
}

/**
 * Delete article by uuid.
 * Check if the user have access to delete this article.
 * Update join table to new updating values.
 *
 * @param {express.Request}  req Article id.
 * @param {express.Response} res
 *
 * @return {object} Success message.
 */
async function deleteArticle(req, res) {
  const { articleId } = req.params;
  const article = await singleArticle(articleId);

  if (req.user.id !== article.userId) {
    throw new Validation('You do not have an access to update this article.');
  }

  removeArticle(articleId);
  // removeArticleTag(articleId);
  // removeArticleComment(articleId);

  res.status(200).json(response(200, null, 'Article Deleted!'));
}

module.exports = {
  putArticle,
  postArticle,
  getArticles,
  deleteArticle,
  getSingleArticle,
};
