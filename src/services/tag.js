const { User, Article, Comment, Tag } = require('../models');
const { getArray } = require('../utils/get-array');

/**
 * Get all tags name.
 *
 * @returns {Promise<Array>} Tags data without association.
 */
const allTags = async () => {
  const tags = await Tag.findAll();
  return getArray(tags);
};

/**
 * Get just specific tags.
 *
 * @param {Array} name Tag names.
 *
 * @returns {Promise<Array>} Tags data.
 */
const includesTag = async (name) => {
  const tags = await Tag.findAll({ where: { name } });
  return getArray(tags);
};

/**
 * Get all tags with all related articles and user.
 *
 * @returns {Promise<Array>} Tags with Articles:{data,user & comments}.
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
 * @param {Object} tags Tag name.
 *
 * @return {Promise<Array>} Tags data.
 */
const createTags = async (name) => {
  const data = await Tag.bulkCreate(name);
  return getArray(data);
};
module.exports = { allTags, createTags, tagsWithArticles, includesTag };
