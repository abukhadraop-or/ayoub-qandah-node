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
router.get('/', getArticles);
router.post('/', authMiddleware, postArticle);

router.get('/:id', getSingleArticle);
router.patch('/:id', authMiddleware, putArticle);
router.delete('/:id', authMiddleware, deleteArticle);

module.exports = router;
