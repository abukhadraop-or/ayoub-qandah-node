const response = require('../utils/response');
const { DatabaseErr, Validation } = require('../middleware/error_handling');
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
 * @param {express.Request}  req Body & userId.
 * @param {express.Response} res
 *
 * @return {object} Comment data.
 */
async function postComment(req, res) {
  const article = await singleArticle(req.body.articleId);
  if (!article) throw new Validation('Invalid article id.');
  if (req.user.id !== article.dataValues.userId) {
    throw new Validation('You do not have an access.');
  }

  req.body.userId = req.user.id;

  const comment = await addComment(req.body);
  if (!comment) throw new DatabaseErr('Invalid inserting comment.');

  const joinTable = addArticleComment(
    article.dataValues.id,
    comment.dataValues.id
  );
  if (!joinTable) throw new DatabaseErr('Error in ArticleComment join table.');

  res.status(200).json(response(200, comment, 'Comment created.'));
}

/**
 * Get all comments with user associate.
 *
 * @param {express.Request}  req
 * @param {express.Response} res
 *
 * @return {object} Comments.
 */
async function getComments(req, res) {
  const data = await allComments();
  if (!data) {
    throw new DatabaseErr('Invalid get comments in database.');
  }
  res.status(200).json(response(200, data, 'Success!'));
}

/**
 * Update specific comment by id.
 *
 * @param {express.Request}  req Comment id.
 * @param {express.Response} res
 *
 * @return {object} Comment updated.
 */
async function putComment(req, res) {
  if (req.user.id !== req.body.id) {
    throw new Validation("You don't have an access.");
  }
  req.body.userId = req.user.id;
  const comment = await updateComment(req.body);
  if (!comment) throw new Validation('Invalid comment id or body data.');

  const updatedData = await singleComment(req.body.id);
  if (!updatedData) {
    throw new DatabaseErr('Invalid get single comment data.');
  }

  res.json(response(200, updatedData, 'Comment updated.'));
}

/**
 * Delete specific comment by id.
 *
 * @param {express.Request}  req Comment id.
 * @param {express.Response} res
 *
 * @return {object} Comment deleted.
 */
async function deleteComment(req, res) {
  const { id } = req.params;
  const preComment = await singleComment(id);

  if (!preComment) {
    throw new Validation('Invalid id.');
  }
  if (preComment.dataValues.userId !== req.user.id) {
    throw new Validation('You do not have an access.');
  }
  const comment = removeComment(id);
  if (!comment) throw new Validation('Invalid comment id.');

  res.json(response(200, null, 'Comment Deleted.'));
}

module.exports = {
  postComment,
  getComments,
  putComment,
  deleteComment,
};
