const { User, Article, Comment } = require('../models');

const createUser = async (values) => {
  const user = await User.create(values);
  return user;
};
const getUser = async (email) => {
  const user = await User.findOne({ where: { email } });
  return user;
};
const updateUser = async (values, id) => {
  const user = await User.update(values, { where: { id } });
  return user;
};
const userArticles = async (id) => {
  const data = await User.findOne({
    where: { id },
    include: [
      {
        model: Article,
        include: [
          { model: User, as: 'user', attributes: ['username'] },
          {
            model: Comment,
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['username'],
              },
            ],
          },
        ],
      },
    ],
  });
  return data;
};

module.exports = { userArticles, createUser, getUser, updateUser };
