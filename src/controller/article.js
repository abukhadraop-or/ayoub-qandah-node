const { validationResult } = require('express-validator');
const {
  NotFound,
  Validation,
  Authentication,
} = require('../middleware/error-handler');
const {
  addArticle,
  allArticles,
  singleArticle,
  removeArticle,
  updateArticle,
} = require('../services/article');

const { articleTag } = require('../services/article-tag');
const { createTags, includesTag } = require('../services/tag');
const response = require('../utils/response');

/**
 * Create new article.
 * Check if the user id is invalid.
 * Make association between article & Tags.
 * Make association between article & user that's added an article.
 *
 * @param {express.Request}  req Body,slug,title,userId,tag_list,favorite,description & favorites_count.
 * @param {express.Response} res
 *
 * @return {Object} Article information's.
 */
async function postArticle(req, res) {
  const { tagList, ...articleBody } = req.body;
  articleBody.userId = req.user.id;

  const dbArticle = await addArticle(articleBody);
  const dbTags = await includesTag(tagList);

  const newTags = [];
  const existingTags = [];
  tagList.forEach((tag) => {
    const dbTag = dbTags.find((t) => t.name === tag);
    (dbTag ? existingTags : newTags).push(dbTag || { name: tag });
  });

  let addTags = [];
  if (newTags.length) {
    addTags = await createTags(newTags);
  }

  await articleTag(
    [...existingTags, ...addTags].map((t) => ({
      TagId: t.id,
      ArticleId: dbArticle.id,
    }))
  );

  res.json(response(dbArticle));
}

/**
 * Get all articles with all associations.
 *
 * @param {express.Request}  req
 * @param {express.Response} res
 *
 * @return {Object} Articles information,(User:username,Comments:[],Tags:[]).
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
 * @return {Object}  Articles information,(User:username,Comments:[],Tags:[]).
 */
async function getSingleArticle(req, res) {
  const { id } = req.params;
  const data = await singleArticle(id);

  if (!data) throw new NotFound('Wrong id!');

  res.json(response(data));
}

/**
 * Update article by id.
 * Check if the user have access to update this article.
 *
 * @param {express.Request}  req Slug, title, description, body, taglist, uuid, userId.
 * @param {express.Response} res
 *
 * @return {Object} Article information after updating.
 */
async function patchArticle(req, res) {
  const { id } = req.params;
  const article = await singleArticle(id);

  if (!article) {
    throw new NotFound('Wrong id!');
  }

  if (article.userId !== req.user.id) {
    throw new Authentication();
  }

  const [ro, data] = await updateArticle(id, req.body);

  res.json(response([ro, ...data]));
}

/**
 * Delete article by id.
 * Check if the user have access to delete this article.
 *
 * @param {express.Request}  req Article id.
 * @param {express.Response} res
 *
 * @return {Object} Success message.
 */
async function deleteArticle(req, res) {
  const { id } = req.params;
  const article = await singleArticle(id);

  if (req.user.id !== article.userId) {
    throw new Validation('You do not have an access to update this article.');
  }

  await removeArticle(id);

  res.json(response(null, 200, 'Article deleted.'));
}

module.exports = {
  postArticle,
  getArticles,
  patchArticle,
  deleteArticle,
  getSingleArticle,
};
