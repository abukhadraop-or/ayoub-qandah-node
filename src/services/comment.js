const response = require("../utils/response");
const { invalidValues, commentError } = require("../middleware/errorhandling");
const {
  user,
  article,
  comment,
  article_comment, // eslint-disable-line camelcase
} = require("../../models");

async function addComment(req, res) {
  const { body, userId, articleId } = req.body;
  const userData = await user.findOne({ where: { uuid: userId } });
  const Article = await article.findOne({ where: { uuid: articleId } });
  if (!userData) throw new invalidValues("Invalid user id."); // eslint-disable-line new-cap
  if (!Article) throw new invalidValues("Invalid article id."); // eslint-disable-line new-cap
  const createComment = await comment
    .create({ body, userId: userData.id })
    .catch(() => {
      throw new commentError("Invalid creating comment in database."); // eslint-disable-line new-cap
    });

  await article_comment.create({
    articleId: Article.id,
    commentId: createComment.id,
  });
  res.status(200).json(response(200, createComment, "Comment created."));
}
async function getComments(req, res) {
  const allComments = await comment
    .findAll({
      include: [{ model: user, as: "user" }],
    })
    .catch(() => {
      throw new commentError("Invalid get comments in database."); // eslint-disable-line new-cap
    });

  res.status(200).json(response(200, allComments, "Success!"));
}

async function updateComment(req, res) {
  const { body, id } = req.body;
  const Comment = await comment.update({ body }, { where: { id } });
  if (!Comment) throw new invalidValues("Invalid comment id or body data."); // eslint-disable-line new-cap
  const commentData = await comment.findOne({ where: { id } });
  res.json(response(200, commentData, "Comment updated."));
}

async function deleteComment(req, res) {
  const { id } = req.params;
  const Comment = await comment.destroy({ where: { id } });
  if (!Comment) throw new invalidValues("Invalid comment id."); // eslint-disable-line new-cap
  res.json(response(200, null, "Comment Deleted."));
}

module.exports = {
  addComment,
  getComments,
  updateComment,
  deleteComment,
};
