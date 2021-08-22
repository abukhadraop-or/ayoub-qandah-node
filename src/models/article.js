const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate({ User, Tag, Comment }) {
      this.belongsTo(User, { foreignKey: "userId", as: "user" });
      this.belongsToMany(Tag, { through: "ArticleTag" });
      this.belongsToMany(Comment, { through: "ArticleComment" });
    }
  }
  Article.init(
    {
      slug: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      body: DataTypes.STRING,
      tagList: DataTypes.ARRAY(DataTypes.STRING),
      favorites_count: DataTypes.INTEGER,
      favorited: {
        type: new DataTypes.VIRTUAL(DataTypes.BOOLEAN),
        get() {
          return false;
        },
      },
    },
    {
      sequelize,
      tableName: "Articles",
      modelName: "Article",
    }
  );
  return Article;
};
