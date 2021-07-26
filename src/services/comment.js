const response = require("../utils/response");
const { InvalidValues, CommentError } = require("../middleware/errorhandling");
const {
  user,
  article,
  comment,
  article_comment, // eslint-disable-line camelcase
} = require("../../models");

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
  const { body, userId, articleId } = req.body;
  const userData = await user.findOne({ where: { id: userId } });
  const Article = await article.findOne({ where: { id: articleId } });
  if (!userData) throw new InvalidValues("Invalid user id.");
  if (!Article) throw new InvalidValues("Invalid article id.");
  const createComment = await comment
    .create({ body, userId: userData.id })
    .catch(() => {
      throw new CommentError("Invalid creating comment in database.");
    });

  await article_comment.create({
    articleId: Article.id,
    commentId: createComment.id,
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
  const allComments = await comment
    .findAll({
      include: [{ model: user, as: "user" }],
    })
    .catch(() => {
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
  const Comment = await comment.update({ body }, { where: { id } });
  if (!Comment) throw new InvalidValues("Invalid comment id or body data.");
  const commentData = await comment.findOne({ where: { id } });
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
  const Comment = await comment.destroy({ where: { id } });
  if (!Comment) throw new InvalidValues("Invalid comment id.");
  res.json(response(200, null, "Comment Deleted."));
}

module.exports = {
  addComment,
  getComments,
  updateComment,
  deleteComment,
};
