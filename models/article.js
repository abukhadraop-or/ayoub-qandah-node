const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class article extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ user, tag, comment }) {
      // define association here
      this.belongsTo(user, { foreignKey: "userId", as: "user" });
      this.belongsToMany(tag, { through: "article_tag" });
      this.belongsToMany(comment, { through: "article_comment" });
    }

    toJSON() {
      return { ...this.get(), id: undefined };
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
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
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
