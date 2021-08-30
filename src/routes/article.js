const router = require('express-promise-router')();
const {
  patchArticle,
  postArticle,
  getArticles,
  deleteArticle,
  getSingleArticle,
} = require('../controller/article');
const authMiddleware = require('../middleware/bearer');
const { articleValidator } = require('../middleware/article-validator');

/**
 * Article routes.
 */
router.get('/', getArticles);
router.post('/', articleValidator, authMiddleware, postArticle);

router.get('/:id', getSingleArticle);
router.patch('/:id', articleValidator, authMiddleware, patchArticle);
router.delete('/:id', authMiddleware, deleteArticle);

module.exports = router;
