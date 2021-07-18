const express = require("express");
const userRoute = require("./routes/user");
const articleRoute = require("./routes/article");
const commentRoute = require("./routes/comment");
const tagRoute = require("./routes/tag");
const authRoute = require("./routes/auth");
const authMiddleware = require("./middleware/bearer");

const app = express();
app.use(express.json());

app.use("/api", userRoute);
app.use("/api", authRoute);
app.use("/api", authMiddleware, articleRoute);
app.use("/api", authMiddleware, commentRoute);
app.use("/api", authMiddleware, tagRoute);

module.exports = {
  start: (port) => {
    if (port) {
      app.listen(port, () => {
        console.log("Heard From", port);
      });
    } else {
      console.log("Missing port.");
    }
  },
};
