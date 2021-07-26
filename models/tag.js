const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class tag extends Model {
    static associate({ article }) {
      this.belongsToMany(article, {
        through: "article_tag",
      });
    }
  }
  tag.init(
    {
      tags: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "tag",
    }
  );
  return tag;
};
