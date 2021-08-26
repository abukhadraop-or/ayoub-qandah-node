const { validationResult } = require('express-validator');
const { Validation } = require('../middleware/error-handler');
const {
  addArticle,
  allArticles,
  singleArticle,
  removeArticle,
  updateArticle,
} = require('../services/article');
const { removeArticleComment } = require('../services/article_comment');
const { articleTag, removeArticleTag } = require('../services/article_tag');
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

  const ArticleId = dbArticle.id;
  const filterTags = [];
  const articleTagsId = [];

  /**
   * Filtering exist tags and new tags.
   */
  for (let x = 0; x < tagList.length; x += 1) {
    if (dbTags.length >= x && dbTags.length) {
      if (!tagList.includes(dbTags[x].name)) {
        filterTags.push({ name: tagList[x] });
      } else {
        articleTagsId.push({
          TagId: dbTags[x].id,
          ArticleId,
        });
      }
    } else {
      filterTags.push({ name: tagList[x] });
    }
  }

  /**
   * Adding new tags if not exist.
   */
  if (filterTags.length) {
    const addTags = await createTags(filterTags);
    for (let x = 0; x < addTags.length; x += 1) {
      articleTagsId.push({
        TagId: addTags[x].id,
        ArticleId: dbArticle.id,
      });
    }
  }

  articleTag(articleTagsId);

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

  res.status(200).json(response(200, data, 'success!'));
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

  res.status(200).json(response(200, data, 'success!'));
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
  let article = singleArticle(req.body.id);

  req.body.userId = req.user.id;

  await updateArticle(req.body);

  article = singleArticle(req.body.id);

  res.status(200).json(response(200, article, 'Article updated.'));
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
  removeArticleTag(articleId);
  removeArticleComment(articleId);

  res.status(200).json(response(200, null, 'Article Deleted!'));
}

module.exports = {
  putArticle,
  postArticle,
  getArticles,
  deleteArticle,
  getSingleArticle,
};
