const response = require("../utils/response");
const { tagError } = require("../middleware/errorhandling");
const { user, article, comment, tag } = require("../../models");

async function allTags(req, res) {
  const tags = await tag.findAll().catch(() => {
    throw new tagError("Error gettin tags from database."); // eslint-disable-line new-cap
  });
  res.status(200).json(response(200, tags, "Success!"));
}

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
      throw new tagError("Error gettin tags from database."); // eslint-disable-line new-cap
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
