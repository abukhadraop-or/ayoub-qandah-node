const router = require("express-promise-router")();

const {
  addComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../services/comment");

/**
 * Comment routes.
 */
router.post("/comment", addComment);
router.get("/comments", getComments);
router.put("/comment", updateComment);
router.delete("/comment/:id", deleteComment);

module.exports = router;
