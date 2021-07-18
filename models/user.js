const { Model } = require("sequelize");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ article, comment }) {
      // define association here
      this.hasOne(article, { foreignKey: "userId" });
      this.hasOne(comment, { foreignKey: "userId" });
    }

    toJSON() {
      return { ...this.get(), id: undefined };
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
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      token: {
        type: DataTypes.VIRTUAL(DataTypes.STRING),
        get() {
          const tokenObject = {
            uuid: this.uuid,
            username: this.username,
            email: this.email,
            password: this.password,
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
  user.beforeCreate("beforeCreate", async (value) => {
    const pass = value.password;
    const hashPassword = await bcrypt.hash(pass, 10);
    value.password = hashPassword;
    // user.setDataValue("password", hashPassword);
  });
  return user;
};
