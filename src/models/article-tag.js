const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ArticleTag extends Model {}

  ArticleTag.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      ArticleId: DataTypes.INTEGER,
      TagId: DataTypes.INTEGER,
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
      modelName: 'ArticleTag',
    }
  );
  return ArticleTag;
};
