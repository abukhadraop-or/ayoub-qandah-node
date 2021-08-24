const router = require('express-promise-router')();

const {
  postComment,
  getComments,
  putComment,
  deleteComment,
} = require('../controller/comment');
const authMiddleware = require('../middleware/bearer');

/**
 * Comment routes.
 */
router.put('/comment', authMiddleware, putComment);
router.post('/comment', authMiddleware, postComment);
router.get('/comments', authMiddleware, getComments);
router.delete('/comment/:id', authMiddleware, deleteComment);

module.exports = router;
