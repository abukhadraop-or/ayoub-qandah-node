const response = require("../utils/response");
const { TagError } = require("../middleware/errorhandling");
const { User, Article, Comment, Tag } = require("../../models");

/**
 * Get all tags name.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 *
 * @return {Promise<object>} -Tag names without any association.
 *
 */
async function allTags(req, res) {
  const tags = await Tag.findAll().catch(() => {
    throw new TagError("Error getting tags from database.");
  });
  res.status(200).json(response(200, tags, "Success!"));
}

/**
 * Get all tags name with articles.
 * Sorting the tags by number of articles have a tag.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 *
 * @return {Promise<object>} -Tag names with article(username) & comment(username).
 *
 */
async function tagsWithArticles(req, res) {
  const tags = await Tag.findAll({
    include: [
      {
        model: Article,
        include: [
          { model: User, as: "user", attributes: ["username"] },
          {
            model: Comment,
            include: [{ model: User, as: "user", attributes: ["username"] }],
          },
        ],
      },
    ],
  }).catch(() => {
    throw new TagError("Error gettin tags from database.");
  });
  const sortingTags = tags.sort(
    (a, b) => b.Articles.length - a.Articles.length
  );
  res.status(200).json(response(200, sortingTags, "Success!"));
}

module.exports = {
  allTags,
  tagsWithArticles,
};
