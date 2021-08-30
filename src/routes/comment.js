const router = require('express-promise-router')();

const {
  putComment,
  postComment,
  getComments,
  deleteComment,
} = require('../controller/comment');
const authMiddleware = require('../middleware/bearer');

/**
 * Comment routes.
 */
router.get('/', authMiddleware, getComments);
router.post('/', authMiddleware, postComment);

router.put('/:id', authMiddleware, putComment);
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;
