const express = require("express");

const router = express.Router();
const {
  user,
  article,
  comment,
  // eslint-disable-next-line camelcase
  article_comment,
} = require("../../models");

router.post("/comment", async (req, res) => {
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
});

router.get("/comments", async (req, res) => {
  const allComments = await comment.findAll({
    include: [{ model: user, as: "user" }],
  });

  res.status(200).json({ code: 200, data: allComments });
});

router.put("/comment", async (req, res) => {
  try {
    const { body, id } = req.body;
    await comment.update({ body }, { where: { id } });
    const commentData = await comment.findOne({ where: { id } });

    res.json(commentData);
  } catch (e) {
    res.json(e);
  }
});
router.delete("/comment/:id", async (req, res) => {
  const { id } = req.params;
  const commentData = await comment.destroy({ where: { id } });
  res.json({ code: 200, msg: "Comment Deleted." });
});

module.exports = router;
