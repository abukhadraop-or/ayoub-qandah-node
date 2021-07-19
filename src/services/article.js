const { articleError, invalidValues } = require("../middleware/errorhandling");
const response = require("../utils/response");
const {
  tag,
  user,
  article,
  comment,
  article_tag, // eslint-disable-line camelcase
} = require("../../models");

async function addArticle(req, res) {
  const {
    body,
    slug,
    title,
    userId,
    tag_list, // eslint-disable-line camelcase
    favorited,
    description,
    favorites_count, // eslint-disable-line camelcase
  } = req.body;
  const userData = await user
    .findOne({ where: { uuid: userId } })
    .catch((e) => {
      throw new invalidValues("Invalid user id."); // eslint-disable-line new-cap
    });
  const createArticle = await article
    .create({
      slug,
      body,
      title,
      tag_list,
      favorited,
      description,
      favorites_count,
      userId: userData.id,
    })
    .catch((e) => {
      throw new articleError("Error in values data type or name of fields."); // eslint-disable-line new-cap
    });
  for (let x = 0; x < tag_list.length; x += 1) {
    // eslint-disable-next-line no-await-in-loop
    await tag.create({ tags: tag_list[x] }).catch((e) => {});
    // eslint-disable-next-line no-await-in-loop
    const Tag = await tag.findOne({ where: { tags: tag_list[x] } });
    if (!Tag) {
      throw new articleError("Error get tag from database."); // eslint-disable-line new-cap
    }
    // eslint-disable-next-line no-await-in-loop
    await article_tag
      .create({
        tagId: Tag.id,
        articleId: createArticle.id,
      })
      .catch((e) => {
        throw new articleError("Error in values data type or name of fields."); // eslint-disable-line new-cap
      });
  }
  res.status(200).json(response(200, createArticle, "Article created."));
}

async function allArticles(req, res) {
  const allPosts = await article
    .findAndCountAll({
      include: [
        { model: user, as: "user", attributes: ["username"] },
        {
          model: comment,
          include: [
            {
              model: user,
              as: "user",
              attributes: ["username"],
            },
          ],
        },
      ],
    })
    .catch((e) => {
      throw new articleError("Error finding the articles from database."); // eslint-disable-line new-cap
    });
  res.status(200).json(response(200, allPosts, "success!"));
}

async function singleArticle(req, res) {
  const { uuid } = req.params;
  const Article = await article.findOne({
    where: { uuid },
    include: [
      { model: user, as: "user", attributes: ["username"] },
      { model: tag },
      {
        mode: comment,
        include: [{ model: user, as: "user", attributes: ["username"] }],
      },
    ],
  });
  if (!Article) {
    throw new invalidValues("Invalid article id."); // eslint-disable-line new-cap
  }
  res.status(200).json(response(200, Article, "success!"));
}

// eslint-disable-next-line consistent-return
async function updateArticle(req, res) {
  // eslint-disable-next-line camelcase
  const { slug, title, description, body, tag_list, uuid } = req.body;
  await article
    .update({ slug, title, description, body, tag_list }, { where: { uuid } })
    .catch((e) => {
      throw new articleError("Error in values data type or name of fields."); // eslint-disable-line new-cap
    });

  const Article = await article.findOne({ where: { uuid } });
  if (!Article) throw new articleError("Invalid article id."); // eslint-disable-line new-cap
  await article_tag.destroy({ where: { articleId: Article.id } });

  for (let x = 0; x < tag_list.length; x += 1) {
    // eslint-disable-next-line no-await-in-loop
    await tag.create({ tags: tag_list[x] }).catch((e) => {});
    // eslint-disable-next-line no-await-in-loop
    const Tag = await tag.findOne({ where: { tags: tag_list[x] } });
    if (!Tag) throw new articleError("Error Tag not found."); // eslint-disable-line new-cap
    // eslint-disable-next-line no-await-in-loop
    await article_tag.create({
      articleId: Article.id,
      tagId: Tag.id,
    });
  }
  res.status(200).json(response(200, Article, "Article updated."));
}

async function deleteArticle(req, res) {
  const { uuid } = req.params;
  const Article = await article.destroy({ where: { uuid } });
  if (!Article) throw new invalidValues("Invalid article id."); // eslint-disable-line new-cap

  res.status(200).json(response(200, null, "Article Deleted!"));
}

module.exports = {
  addArticle,
  allArticles,
  singleArticle,
  updateArticle,
  deleteArticle,
};
