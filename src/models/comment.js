const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate({ User, Article }) {
      this.belongsTo(User, { foreignKey: 'userId', as: 'user' });
      this.belongsToMany(Article, {
        through: 'ArticleComment',
      });
    }
  }
  Comment.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      body: { type: DataTypes.STRING },
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
      modelName: 'Comment',
    }
  );
  return Comment;
};
