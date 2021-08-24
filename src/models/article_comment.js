const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ArticleComment extends Model {
    static associate(models) {}
  }
  ArticleComment.init(
    {
      ArticleId: DataTypes.INTEGER,
      CommentId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'ArticleComment',
    }
  );
  return ArticleComment;
};
