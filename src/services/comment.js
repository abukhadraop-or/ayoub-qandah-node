const {
  user,
  article,
  comment,
  // eslint-disable-next-line camelcase
  article_comment,
} = require("../../models");

async function addComment(req, res) {
  try {
    const { body, userId, articleId } = req.body;
    const userData = await user.findOne({ where: { uuid: userId } });
    const createComment = await comment.create({ body, userId: userData.id });
    const Article = await article.findOne({ where: { uuid: articleId } });
    console.log(Article);
    await article_comment.create({
      articleId: Article.id,
      commentId: createComment.id,
    });
    res.status(200).json({ code: 200, data: createComment });
  } catch (e) {
    console.log(e);
    res.json(e);
  }
}
async function getComments(req, res) {
  const allComments = await comment.findAll({
    include: [{ model: user, as: "user" }],
  });

  res.status(200).json({ code: 200, data: allComments });
}

async function updateComment(req, res) {
  try {
    const { body, id } = req.body;
    await comment.update({ body }, { where: { id } });
    const commentData = await comment.findOne({ where: { id } });

    res.json(commentData);
  } catch (e) {
    res.json(e);
  }
}

async function deleteComment(req, res) {
  const { id } = req.params;
  await comment.destroy({ where: { id } });
  res.json({ code: 200, msg: "Comment Deleted." });
}

module.exports = {
  addComment,
  getComments,
  updateComment,
  deleteComment,
};
