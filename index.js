require("dotenv").config();
const { sequelize } = require("./models");
const { start } = require("./src/server");

sequelize.authenticate().then(() => {
  start(process.env.PORT);
});
