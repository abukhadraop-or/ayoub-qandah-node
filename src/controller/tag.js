const response = require('../utils/response');
const { allTags, tagsWithArticles } = require('../services/tag');
const { InternalError, NotFound } = require('../middleware/error-handler');

/**
 * Get all tags name without any association.
 *
 * @param {express.Request}  req
 * @param {express.Response} res
 *
 * @return {Object} Tag names.
 */
async function getTags(req, res) {
  const data = await allTags();

  res.json(response(data));
}

/**
 * Get all tags data without association.
 * Sorting the tags by number of articles have specific tag.
 *
 * @param {express.Request}  req
 * @param {express.Response} res
 *
 * @return {Object} Tags data with articles(article data,user:username) & comment(comment data,username).
 */
async function getTagsWithArticles(req, res) {
  const tags = await tagsWithArticles();

  const sortingTags = tags.sort(
    (a, b) => b.Articles.length - a.Articles.length
  );

  res.json(response(sortingTags));
}

module.exports = {
  getTags,
  getTagsWithArticles,
};
