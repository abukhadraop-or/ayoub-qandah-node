const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class article_comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
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
  return article_comment;
};
