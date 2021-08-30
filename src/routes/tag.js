const router = require('express-promise-router')();

const { getTags, getTagsWithArticles } = require('../controller/tag');

/**
 * Tag routes.
 */
router.get('/', getTags);

router.get('/articles', getTagsWithArticles);

module.exports = router;
