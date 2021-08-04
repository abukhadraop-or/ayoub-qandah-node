const { Model } = require("sequelize");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate({ article, comment }) {
      this.hasMany(article, { foreignKey: "userId" });
      this.hasOne(comment, { foreignKey: "userId" });
    }

    toJSON() {
      return { ...this.get(), password: undefined };
    }
  }
  user.init(
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
      tableName: "users",
      modelName: "user",
    }
  );
  /**
   * Hooks function to hashing password before saving it in database.
   */
  user.beforeCreate("beforeCreate", async (value) => {
    const pass = value.password;
    const hashPassword = await bcrypt.hash(pass, 10);
    value.password = hashPassword;
    // user.setDataValue("password", hashPassword);
  });
  return user;
};
