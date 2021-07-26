const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class article extends Model {
    static associate({ user, tag, comment }) {
      this.belongsTo(user, { foreignKey: "userId", as: "user" });
      this.belongsToMany(tag, { through: "article_tag" });
      this.belongsToMany(comment, { through: "article_comment" });
    }
  }
  article.init(
    {
      slug: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      body: DataTypes.STRING,
      tag_list: DataTypes.ARRAY(DataTypes.STRING),
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
      tableName: "articles",
      modelName: "article",
    }
  );
  async function test(value) {
    // console.log("passeeeed", value);
  }
  return article;
};
