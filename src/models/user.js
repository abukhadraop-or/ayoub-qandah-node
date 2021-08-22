const { Model } = require("sequelize");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate({ Article, Comment }) {
      this.hasMany(Article, { foreignKey: "userId" });
      this.hasOne(Comment, { foreignKey: "userId" });
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
      token: {
        type: DataTypes.VIRTUAL(DataTypes.STRING),
        get() {
          const tokenObject = {
            id: this.id,
            username: this.username,
            email: this.email,
          };

          const JWT = jwt.sign(tokenObject, process.env.SECRET);
          return JWT;
        },
      },
    },
    {
      sequelize,
      tableName: "Users",
      modelName: "User",
    }
  );
  /**
   * Hooks function to hashing password before saving it in database.
   */
  User.beforeCreate("beforeCreate", async (value) => {
    const pass = value.password;
    const hashPassword = await bcrypt.hash(pass, 10);
    value.password = hashPassword;
  });
  return User;
};
