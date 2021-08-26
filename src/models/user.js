const { Model } = require('sequelize');
require('dotenv').config();

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Article, Comment }) {
      this.hasMany(Article, {
        foreignKey: 'userId',
        onDelete: 'cascade',
        hooks: true,
      });
      this.hasOne(Comment, { foreignKey: 'userId' });
    }

    toJSON() {
      return { ...this.get(), password: undefined };
    }
  }
  User.init(
    {
      id: {
        unique: true,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
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
      tableName: 'Users',
      modelName: 'User',
    }
  );
  return User;
};
