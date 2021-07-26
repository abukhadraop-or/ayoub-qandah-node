const router = require("express-promise-router")();
const {
  addArticle,
  allArticles,
  singleArticle,
  updateArticle,
  deleteArticle,
} = require("../services/article");
const authMiddleware = require("../middleware/bearer");

/**
 * Article routes.
 */
router.post("/article", authMiddleware, addArticle);
router.get("/articles", allArticles);
router.patch("/article", authMiddleware, updateArticle);
router.get("/article/:uuid", singleArticle);
router.delete("/article/:articleId/:userId", authMiddleware, deleteArticle);

module.exports = router;
