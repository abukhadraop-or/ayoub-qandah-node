const { Model } = require('sequelize');
require('dotenv').config();

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Article, Comment }) {
      this.hasMany(Article, { foreignKey: 'userId' });
      this.hasOne(Comment, { foreignKey: 'userId' });
    }

    toJSON() {
      return { ...this.get(), password: undefined };
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
      },
      username: {
        type: DataTypes.STRING,
      },
      bio: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      tableName: 'Users',
      modelName: 'User',
    }
  );
  return User;
};
