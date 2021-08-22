const response = require("../utils/response");
const { InvalidValues, CommentError } = require("../middleware/errorhandling");
const { User, Article, Comment, ArticleComment } = require("../../models");

/**
 * Create comment to article.
 * Make association between comment & article.
 * Make association between comment & user that's add the comment.
 *
 * @param {express.Request} req -Body,userId.
 * @param {express.Response} res
 *
 * @return {Promise<object>} -Comment.
 *
 */
async function addComment(req, res) {
  const { body, articleId } = req.body;
  const article = await Article.findOne({ where: { id: articleId } });
  if (!article) throw new InvalidValues("Invalid article id.");
  const createComment = await Comment.create({
    body,
    userId: req.user.id,
  }).catch(() => {
    throw new CommentError("Invalid creating comment in database.");
  });

  await ArticleComment.create({
    ArticleId: article.id,
    CommentId: createComment.id,
  });
  res.status(200).json(response(200, createComment, "Comment created."));
}

/**
 * Get all comments with user associate.
 *
 * @param {express.Request} req
 * @param {express.Response} res
 *
 * @return {Promise<object>} -Comments.
 *
 */
async function getComments(req, res) {
  const allComments = await Comment.findAll({
    include: [{ model: User, as: "user" }],
  }).catch(() => {
    throw new CommentError("Invalid get comments in database.");
  });

  res.status(200).json(response(200, allComments, "Success!"));
}

/**
 * Update specific comment by id.
 *
 * @param {express.Request} req -Comment id.
 * @param {express.Response} res
 *
 * @return {Promise<object>} -Comment updated.
 *
 */
async function updateComment(req, res) {
  const { body, id } = req.body;
  const comment = await Comment.update({ body }, { where: { id } });
  if (!comment) throw new InvalidValues("Invalid comment id or body data.");
  const commentData = await Comment.findOne({ where: { id } });
  res.json(response(200, commentData, "Comment updated."));
}

/**
 * Delete specific comment by id.
 *
 * @param {express.Request} req -Comment id.
 * @param {express.Response} res
 *
 * @return {Promise<object>} -Comment deleted.
 *
 */
async function deleteComment(req, res) {
  const { id } = req.params;
  const comment = await Comment.destroy({ where: { id } });
  if (!comment) throw new InvalidValues("Invalid comment id.");
  res.json(response(200, null, "Comment Deleted."));
}

module.exports = {
  addComment,
  getComments,
  updateComment,
  deleteComment,
};
