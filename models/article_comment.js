const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  // eslint-disable-next-line camelcase
  class article_comment extends Model {
    static associate(models) {
    }
  }
  article_comment.init(
    {
      articleId: DataTypes.INTEGER,
      commentId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "article_comment",
    }
  );
  // eslint-disable-next-line camelcase
  return article_comment;
};
