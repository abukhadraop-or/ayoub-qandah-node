const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    static associate({ user, article }) {
      this.belongsTo(user, { foreignKey: "userId", as: "user" });
      this.belongsToMany(article, { through: "article_comment" });
    }
  }
  comment.init(
    {
      body: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "comment",
    }
  );
  return comment;
};
