const { user, article, comment, tag } = require("../../models");

async function allTags(req, res) {
  const tags = await tag.findAll();
  res.status(200).json({ code: 200, data: tags });
}

async function tagsWithArticles(req, res) {
  const tags = await tag.findAll({
    include: [
      {
        model: article,
        include: [
          { model: user, as: "user" },
          { model: comment, include: [{ model: user, as: "user" }] },
        ],
      },
    ],
  });
  res.status(200).json({ code: 200, data: tags });
}

module.exports = {
  allTags,
  tagsWithArticles,
};
