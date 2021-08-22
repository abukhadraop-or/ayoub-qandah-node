const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ArticleTag extends Model {
    static associate(models) {}
  }
  ArticleTag.init(
    {
      ArticleId: DataTypes.INTEGER,
      TagId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ArticleTag",
    }
  );
  return ArticleTag;
};
