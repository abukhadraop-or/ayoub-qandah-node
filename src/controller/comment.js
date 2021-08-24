const response = require('../utils/response');
const { InvalidValues, CommentError } = require('../middleware/errorhandling');
const {
  addComment,
  allComments,
  updateComment,
  removeComment,
  singleComment,
} = require('../services/comment');
const { singleArticle } = require('../services/article');
const { addArticleComment } = require('../services/article_comment');
/**
 * Create comment to article.
 * Make association between comment & article.
 * Make association between comment & user that's add the comment.
 *
 * @param {express.Request} req -Body,userId.s
 * @param {express.Response} res
 *
 * @return {Promise<object>} -Comment.
 */
async function postComment(req, res) {
  const article = await singleArticle(req.body.articleId);
  if (!article) throw new InvalidValues('Invalid article id.');
  req.body.userId = req.user.id;
  const comment = await addComment(req.body);
  if (!comment) throw new CommentError('Invalid creating comment.');

  const joinTable = addArticleComment(
    article.dataValues.id,
    comment.dataValues.id
  );
  if (!joinTable) throw new CommentError('Error in ArticleComment join table.');

  res.status(200).json(response(200, comment, 'Comment created.'));
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
  const data = await allComments();
  if (!data) {
    throw new CommentError('Invalid get comments in database.');
  }
  res.status(200).json(response(200, data, 'Success!'));
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
async function putComment(req, res) {
  // if (req.user.id !== req.body.id) {
  //   throw new InvalidValues("You don't have an access.");
  // }
  req.body.userId = req.user.id;
  const comment = await updateComment(req.body);
  if (!comment) throw new InvalidValues('Invalid comment id or body data.');
  const updatedData = await singleComment(req.body.id);
  res.json(response(200, updatedData, 'Comment updated.'));
}

/**
 * Delete specific comment by id.
 *
 * @param {express.Request} req -Comment id.
 * @param {express.Response} res
 *
 * @return {Promise<object>} -Comment deleted.
 */
async function deleteComment(req, res) {
  const { id } = req.params;
  const preComment = await singleComment(id);

  if (!preComment) {
    throw new InvalidValues('Invalid id.');
  }
  if (preComment.dataValues.userId !== req.user.id) {
    throw new InvalidValues("You don't have an access.");
  }
  const comment = removeComment(id);
  if (!comment) throw new InvalidValues('Invalid comment id.');

  res.json(response(200, null, 'Comment Deleted.'));
}

module.exports = {
  postComment,
  getComments,
  putComment,
  deleteComment,
};
