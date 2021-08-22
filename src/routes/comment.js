const router = require("express-promise-router")();

const {
  addComment,
  getComments,
  updateComment,
  deleteComment,
} = require("../services/comment");
const authMiddleware = require("../middleware/bearer");

/**
 * Comment routes.
 */
router.post("/comment", authMiddleware, addComment);
router.get("/comments", authMiddleware, getComments);
router.put("/comment", authMiddleware, updateComment);
router.delete("/comment/:id", authMiddleware, deleteComment);

module.exports = router;
