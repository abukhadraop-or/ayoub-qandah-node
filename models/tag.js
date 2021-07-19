const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ article }) {
      // define association here
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
