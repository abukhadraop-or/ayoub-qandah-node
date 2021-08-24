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
router.post('/comment', authMiddleware, postComment);
router.get('/comments', authMiddleware, getComments);
router.put('/comment', authMiddleware, putComment);
router.delete('/comment/:id', authMiddleware, deleteComment);

module.exports = router;
