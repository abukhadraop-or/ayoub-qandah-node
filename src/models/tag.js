const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate({ Article }) {
      this.belongsToMany(Article, {
        through: 'ArticleTag',
      });
    }
  }
  Tag.init(
    {
      tags: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Tag',
    }
  );
  return Tag;
};
