const { User, Article, Comment, Tag } = require('../models');

/**
 * Get all tags name.
 *
 * @returns {Promise<Array>} Tags data.
 */
const allTags = () => {
  const tags = Tag.findAll();
  return tags;
};

/**
 * Get all tags with all related articles and user.
 *
 * @returns {Promise<object>} Tags with Articles:{data,user & comments}.
 */
const tagsWithArticles = () => {
  const tags = Tag.findAll({
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

/**
 * Inserting multi or single  tag.
 *
 * @param {object} tags Tags.
 *
 * @return {Promise<object>} Tags data.
 */
const createTags = async (tags) => {
  const data = await Tag.bulkCreate(tags);
  return data;
};
module.exports = { allTags, createTags, tagsWithArticles };
