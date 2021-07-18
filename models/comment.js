const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ user, article }) {
      // define association here
      this.belongsTo(user, { foreignKey: "userId", as: "user" });
      this.belongsToMany(article, { through: "article_comment" });
    }

    // toJSON() {
    //   return { ...this.get(), id: undefined };
    // }
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
