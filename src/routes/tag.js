const router = require('express-promise-router')();

const { getTags, getTagsWithArticles } = require('../controller/tag');

/**
 * Tag routes.
 */
router.get('/tags', getTags);
router.get('/tags/articles', getTagsWithArticles);

module.exports = router;
