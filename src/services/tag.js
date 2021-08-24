const { User, Article, Comment, Tag } = require('../models');

const allTags = () => {
  const tags = Tag.findAll();
  return tags;
};

const tagsWithArticles = async () => {
  const tags = await Tag.findAll({
    include: [
      {
        model: Article,
        include: [
          { model: User, as: 'user', attributes: ['username'] },
          {
            model: Comment,
            include: [{ model: User, as: 'user', attributes: ['username'] }],
          },
        ],
      },
    ],
  });

  return tags;
};

const createTags = async (tags) => {
  const data = await Tag.bulkCreate(tags);
  return data;
};
module.exports = { allTags, createTags, tagsWithArticles };
