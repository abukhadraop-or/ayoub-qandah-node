const express = require("express");

const router = express.Router();
const { allTags, tagsWithArticles } = require("../services/tag");

router.get("/tags", allTags);
router.get("/tags/articles", tagsWithArticles);

module.exports = router;
