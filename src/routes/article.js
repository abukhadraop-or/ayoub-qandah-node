const router = require('express-promise-router')();
const {
  postArticle,
  getArticles,
  getSingleArticle,
  putArticle,
  deleteArticle,
} = require('../controller/article');
const authMiddleware = require('../middleware/bearer');

/**
 * Article routes.
 */
router.post('/article', authMiddleware, postArticle);
router.get('/articles', getArticles);
router.patch('/article', authMiddleware, putArticle);
router.get('/article/:id', getSingleArticle);
router.delete('/article/:articleId', authMiddleware, deleteArticle);

module.exports = router;
