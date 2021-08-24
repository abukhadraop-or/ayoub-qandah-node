const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate({ User, Article }) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      this.belongsToMany(Article, { through: 'ArticleComment' });
    }
  }
  Comment.init(
    {
      body: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Comment',
    }
  );
  return Comment;
};
