const { User, Article, Comment, ArticleComment } = require('../models');
const { InvalidValues, CommentError } = require('../middleware/errorhandling');

const addComment = async (values) => {
  const createComment = await Comment.create(values);
  return createComment;
};

const allComments = async () => {
  const Comments = await Comment.findAll({
    include: [{ model: User, as: 'user' }],
  });
  return Comments;
};

const updateComment = async (values) => {
  const comment = await Comment.update(values, { where: { id: values.id } });
  return comment;
};

const singleComment = async (id) => {
  const comment = await Comment.findOne({ where: { id } });
  return comment;
};

const removeComment = async (id) => {
  const comment = await Comment.destroy({ where: { id } });
  return comment;
};
module.exports = {
  singleComment,
  removeComment,
  addComment,
  allComments,
  updateComment,
};
