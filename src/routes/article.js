const router = require("express-promise-router")();
const {
  addArticle,
  allArticles,
  singleArticle,
  updateArticle,
  deleteArticle,
} = require("../services/article");

router.post("/article", addArticle);
router.get("/articles", allArticles);
router.patch("/article", updateArticle);
router.get("/article/:uuid", singleArticle);
router.delete("/article/:uuid", deleteArticle);

module.exports = router;
