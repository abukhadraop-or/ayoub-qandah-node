const response = require('../utils/response');
const {
  DatabaseErr,
  Validation,
  NotFound,
  Authentication,
} = require('../middleware/error-handler');
const {
  addComment,
  allComments,
  updateComment,
  removeComment,
  singleComment,
} = require('../services/comment');
const { singleArticle } = require('../services/article');
const { addArticleComment } = require('../services/article-comment');
/**
 * Create comment to article.
 * Make association between comment & article.
 * Make association between comment & user that's add the comment.
 *
 * @param {express.Request}  req Body & userId.
 * @param {express.Response} res
 *
 * @return {Object} Comment data.
 */
async function postComment(req, res) {
  const article = await singleArticle(req.body.articleId);
  if (!article) throw new NotFound('Invalid article id.');
  if (req.user.id !== article.userId) {
    throw new Authentication('You do not have an access.');
  }

  req.body.userId = req.user.id;

  const comment = await addComment(req.body);

  addArticleComment(article.id, comment.id);

  res.json(response(comment));
}

/**
 * Get all comments with user associate.
 *
 * @param {express.Request}  req
 * @param {express.Response} res
 *
 * @return {Array} Comments data (user:username).
 */
async function getComments(req, res) {
  const data = await allComments();

  res.json(response(data));
}

/**
 * Update specific comment by id.
 *
 * @param {express.Request}  req Comment id.
 * @param {express.Response} res
 *
 * @return {Object} Comment updated values.
 */
async function putComment(req, res) {
  const { id } = req.params;
  const getComment = await singleComment(id);

  if (req.user.id !== getComment.userId) {
    throw new Authentication("You don't have an access.");
  }

  const updatedData = await updateComment(id, req.body);

  res.json(response(updatedData));
}

/**
 * Delete specific comment by id.
 * Check if the user has permission.
 *
 * @param {express.Request}  req Comment id.
 * @param {express.Response} res
 *
 * @return {Object} Comment deleted message.
 */
async function deleteComment(req, res) {
  const { id } = req.params;

  const preComment = await singleComment(id);
  if (!preComment) {
    throw new NotFound('Invalid id.');
  }
  if (preComment.userId !== req.user.id) {
    throw new Authentication('You do not have an access.');
  }

  await removeComment(id);

  res.json(response(200, null, 'Comment Deleted.'));
}

module.exports = {
  putComment,
  postComment,
  getComments,
  deleteComment,
};
