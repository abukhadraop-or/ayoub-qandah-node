const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Article extends Model {
    static associate({ User, Tag, Comment }) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      this.belongsToMany(Tag, { through: 'ArticleTag' });
      this.belongsToMany(Comment, {
        through: 'ArticleComment',
      });
    }
  }

  Article.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      slug: DataTypes.STRING,
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      body: DataTypes.STRING,
      favorites_count: DataTypes.INTEGER,
      favorited: DataTypes.BOOLEAN,
      userId: DataTypes.INTEGER,

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      tableName: 'Articles',
      modelName: 'Article',
    }
  );
  return Article;
};
