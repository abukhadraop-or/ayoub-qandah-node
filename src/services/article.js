const { ArticleError, InvalidValues } = require("../middleware/errorhandling");
const response = require("../utils/response");
const {
  tag,
  user,
  article,
  comment,
  article_tag, // eslint-disable-line camelcase
  article_comment, // eslint-disable-line camelcase
} = require("../../models");

/**
 * Create new article.
 * Check if the user id is invalid.
 * Make association between article & comment.
 * Make association between article & user that's added an article.
 *
 * @param {express.Request} req -Body,slug,title,userId,tag_list,favorited,description & favorites_count.
 * @param {express.Response} res
 *
 * @return {Promise<object>} -Article information's.
 *
 */
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
  const userData = await user.findOne({ where: { id: userId } }).catch((e) => {
    throw new InvalidValues("Invalid user id.");
  });
console.log("teeeeeeeeestt");
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
      throw new ArticleError("Error in values data type or name of fields.");
    });
  for (let x = 0; x < tag_list.length; x += 1) {
    // eslint-disable-next-line no-await-in-loop
    await tag.create({ tags: tag_list[x] }).catch((e) => {});
    // eslint-disable-next-line no-await-in-loop
    const Tag = await tag.findOne({ where: { tags: tag_list[x] } });
    if (!Tag) {
      throw new ArticleError("Error get tag from database.");
    }
    // eslint-disable-next-line no-await-in-loop
    await article_tag
      .create({
        tagId: Tag.id,
        articleId: createArticle.id,
      })
      .catch((e) => {
        throw new ArticleError("Error in values data type or name of fields.");
      });
  }
  res.status(200).json(response(200, createArticle, "Article created."));
}

/**
 * Get all articles with all associations.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 *
 * @return {Promise<object>} -Articles information.
 *
 */
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
      throw new ArticleError("Error finding the articles from database.");
    });
  res.status(200).json(response(200, allPosts, "success!"));
}

/**
 * Get single article with all associations.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 *
 * @return {Promise<object>} -Article information.
 *
 */
async function singleArticle(req, res) {
  const { id } = req.params;
  const Article = await article.findOne({
    where: { id },
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
    throw new InvalidValues("Invalid article id.");
  }
  res.status(200).json(response(200, Article, "success!"));
}

/**
 * Update article by uuid.
 * Check if the user have access to update this article.
 * Update join table to new updating values.
 *
 * @param {express.Request} req -Slug, title, description, body, tag_list, uuid, userId
 * @param {express.Response} res
 *
 * @return {Promise<object>} -Article information after updating.
 *
 */
async function updateArticle(req, res) {
  // eslint-disable-next-line camelcase
  const { slug, title, description, body, tag_list, id, userId } = req.body;
  const User = await user.findOne({ where: { id: userId } });
  let Article = await article.findOne({ where: { id } });
  if (!Article) throw new ArticleError("Invalid article id.");
  if (User.id !== Article.userId)
    throw new InvalidValues("You dont have an access to update this article.");
  await article
    .update({ slug, title, description, body, tag_list }, { where: { id } })
    .catch((e) => {
      throw new ArticleError("Error in values data type or name of fields.");
    });

  Article = await article.findOne({ where: { id } });
  await article_tag.destroy({ where: { articleId: Article.id } });

  for (let x = 0; x < tag_list.length; x += 1) {
    // eslint-disable-next-line no-await-in-loop
    await tag.create({ tags: tag_list[x] }).catch((e) => {});
    // eslint-disable-next-line no-await-in-loop
    const Tag = await tag.findOne({ where: { tags: tag_list[x] } });
    if (!Tag) throw new ArticleError("Error Tag not found.");
    // eslint-disable-next-line no-await-in-loop
    await article_tag.create({
      articleId: Article.id,
      tagId: Tag.id,
    });
  }
  res.status(200).json(response(200, Article, "Article updated."));
}

/**
 * Delete article by uuid.
 * Check if the user have access to delete this article.
 * Update join table to new updating values.
 *
 * @param {express.Request} req -Slug, title, description, body, tag_list, uuid, userId
 * @param {express.Response} res
 *
 * @return {Promise<string>} -Success message.
 *
 */
async function deleteArticle(req, res) {
  const { articleId, userId } = req.params;
  const UserId = parseInt(userId, 10);
  const prevArticle = await article.findOne({ where: { id: articleId } });
  if (UserId !== prevArticle.userId) {
    throw new InvalidValues("You dont have an access to update this article.");
  }
  if (!prevArticle) throw new InvalidValues("Invalid article id.");

  await article_tag.destroy({ where: { articleId: prevArticle.id } });
  await article_comment.destroy({ where: { articleId: prevArticle.id } });
  await article.destroy({ where: { id: articleId } });

  res.status(200).json(response(200, null, "Article Deleted!"));
}

module.exports = {
  addArticle,
  allArticles,
  singleArticle,
  updateArticle,
  deleteArticle,
};
