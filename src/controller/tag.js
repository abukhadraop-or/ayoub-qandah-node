const response = require('../utils/response');
const { DatabaseErr } = require('../middleware/error_handling');
const { allTags, tagsWithArticles } = require('../services/tag');

/**
 * Get all tags name without any association.
 *
 * @param {express.Request}  req
 * @param {express.Response} res
 *
 * @return {object} Tag names.
 */
async function getTags(req, res) {
  const data = await allTags();
  if (!data) {
    throw new DatabaseErr('Error in getting tags from database.');
  }

  res.status(200).json(response(200, data, 'Success!'));
}

/**
 * Get all tags name with articles.
 * Sorting the tags by number of articles have specific tag.
 *
 * @param {express.Request}  req
 * @param {express.Response} res
 *
 * @return {object} Tag names with articles(article data,user:username) & comment(comment data,username).
 */
async function getTagsWithArticles(req, res) {
  const tags = await tagsWithArticles();
  if (!tags) {
    throw new DatabaseErr(
      'Error in getting tags with accusation from database.'
    );
  }

  const sortingTags = tags.sort(
    (a, b) => b.Articles.length - a.Articles.length
  );

  res.status(200).json(response(200, sortingTags, 'Success!'));
}

module.exports = {
  getTags,
  getTagsWithArticles,
};
