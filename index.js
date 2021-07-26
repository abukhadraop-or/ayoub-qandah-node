require("dotenv").config();
const { sequelize } = require("./models");
const { start } = require("./src/server");

/**
 * Function to test if the connection to the Database  is OK.
 */
sequelize.authenticate().then(() => {
  start(process.env.PORT);
});
