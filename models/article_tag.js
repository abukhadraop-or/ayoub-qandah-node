const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  // eslint-disable-next-line camelcase
  class article_tag extends Model {
    static associate(models) {}
  }
  article_tag.init(
    {
      articleId: DataTypes.INTEGER,
      tagId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "article_tag",
    }
  );
  // eslint-disable-next-line camelcase
  return article_tag;
};
