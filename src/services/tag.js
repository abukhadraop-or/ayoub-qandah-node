const response = require("../utils/response");
const { TagError } = require("../middleware/errorhandling");
const { user, article, comment, tag } = require("../../models");

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
  const tags = await tag.findAll().catch(() => {
    throw new TagError("Error gettin tags from database.");
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
  const tags = await tag
    .findAll({
      include: [
        {
          model: article,
          include: [
            { model: user, as: "user", attributes: ["username"] },
            {
              model: comment,
              include: [{ model: user, as: "user", attributes: ["username"] }],
            },
          ],
        },
      ],
    })
    .catch(() => {
      throw new TagError("Error gettin tags from database.");
    });
  const sortingTags = tags.sort(
    (a, b) => b.articles.length - a.articles.length
  );
  res.status(200).json(response(200, sortingTags, "Success!"));
}

module.exports = {
  allTags,
  tagsWithArticles,
};
