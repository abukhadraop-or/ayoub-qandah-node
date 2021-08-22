const { ArticleError, InvalidValues } = require("../middleware/errorhandling");
const response = require("../utils/response");
const {
  Tag,
  User,
  Article,
  Comment,
  ArticleTag,
  ArticleComment,
} = require("../models");

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
  const { body, slug, title, tagList, favorited, description, favoritesCount } =
    req.body;
  const userData = await User.findOne({ where: { id: req.user.id } }).catch(
    (e) => {
      throw new InvalidValues("Invalid user id.");
    }
  );

  const createArticle = await Article.create({
    slug,
    body,
    title,
    tagList,
    favorited,
    description,
    favoritesCount,
    userId: userData.id,
  }).catch((e) => {
    throw new ArticleError("Error in values data type or name of fields.");
  });
  for (let x = 0; x < tagList.length; x += 1) {
    // eslint-disable-next-line no-await-in-loop
    await Tag.create({ tags: tagList[x] }).catch((e) => {});

    // eslint-disable-next-line no-await-in-loop
    const tag = await Tag.findOne({ where: { tags: tagList[x] } });

    if (!tag) {
      throw new ArticleError("Error get tag from database.");
    }
    // eslint-disable-next-line no-await-in-loop
    await ArticleTag.create({
      TagId: tag.id,
      ArticleId: createArticle.id,
    }).catch((e) => {
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
  const allPosts = await Article.findAndCountAll({
    include: [
      { model: User, as: "user", attributes: ["username"] },
      {
        model: Comment,
        include: [
          {
            model: User,
            as: "user",
            attributes: ["username"],
          },
        ],
      },
    ],
  }).catch((e) => {
    throw new ArticleError(
      `Error finding the articles from database:- ${e}`,
      501
    );
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
  const article = await Article.findOne({
    where: { id },
    include: [
      { model: User, as: "user", attributes: ["username"] },
      { model: Tag },
      {
        model: Comment,
        include: [{ model: User, as: "user", attributes: ["username"] }],
      },
    ],
  });
  if (!Article) {
    throw new InvalidValues("Invalid article id.");
  }
  res.status(200).json(response(200, article, "success!"));
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
  const user = await User.findOne({ where: { id: userId } });
  let article = await Article.findOne({ where: { id } });
  if (!article) throw new ArticleError("Invalid article id.");
  if (user.id !== Article.userId)
    throw new InvalidValues("You dont have an access to update this article.");
  await article
    .update({ slug, title, description, body, tag_list }, { where: { id } })
    .catch((e) => {
      throw new ArticleError("Error in values data type or name of fields.");
    });

  article = await article.findOne({ where: { id } });
  await ArticleTag.destroy({ where: { ArticleId: article.id } });

  for (let x = 0; x < tag_list.length; x += 1) {
    // eslint-disable-next-line no-await-in-loop
    await Tag.create({ tags: tag_list[x] }).catch((e) => {});
    // eslint-disable-next-line no-await-in-loop
    const tag = await Tag.findOne({ where: { tags: tag_list[x] } });
    if (!Tag) throw new ArticleError("Error Tag not found.");
    // eslint-disable-next-line no-await-in-loop
    await ArticleTag.create({
      ArticleId: article.id,
      tagId: Tag.id,
    });
  }
  res.status(200).json(response(200, article, "Article updated."));
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
  const prevArticle = await Article.findOne({ where: { id: articleId } });
  if (UserId !== prevArticle.userId) {
    throw new InvalidValues("You dont have an access to update this article.");
  }
  if (!prevArticle) throw new InvalidValues("Invalid article id.");

  await ArticleTag.destroy({ where: { ArticleId: prevArticle.id } });
  await ArticleComment.destroy({ where: { ArticleId: prevArticle.id } });
  await Article.destroy({ where: { id: articleId } });

  res.status(200).json(response(200, null, "Article Deleted!"));
}

module.exports = {
  addArticle,
  allArticles,
  singleArticle,
  updateArticle,
  deleteArticle,
};
