const express = require("express");

const router = express.Router();

const {
  addArticle,
  allArticles,
  singleArticle,
  updateArticle,
  deleteArticle,
} = require("../services/article");

router.post("/article", addArticle);
router.get("/articles", allArticles);
router.get("/article/:uuid", singleArticle);
router.patch("/article", updateArticle);
router.delete("/article/uuid", deleteArticle);

module.exports = router;
