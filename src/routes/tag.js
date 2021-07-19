const router = require("express-promise-router")();

const { allTags, tagsWithArticles } = require("../services/tag");

router.get("/tags", allTags);
router.get("/tags/articles", tagsWithArticles);

module.exports = router;
