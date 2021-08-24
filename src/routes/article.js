const router = require('express-promise-router')();
const {
  putArticle,
  postArticle,
  getArticles,
  deleteArticle,
  getSingleArticle,
} = require('../controller/article');
const authMiddleware = require('../middleware/bearer');

/**
 * Article routes.
 */
router.get('/articles', getArticles);
router.get('/article/:id', getSingleArticle);
router.post('/article', authMiddleware, postArticle);
router.patch('/article', authMiddleware, putArticle);
router.delete('/article/:articleId', authMiddleware, deleteArticle);

module.exports = router;
