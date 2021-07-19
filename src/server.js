const morgan = require("morgan");
const app = require("express")();
const tagRoute = require("./routes/tag");
const userRoute = require("./routes/user");
const response = require("./utils/response");
const articleRoute = require("./routes/article");
const commentRoute = require("./routes/comment");
const authMiddleware = require("./middleware/bearer");

app.use(morgan("dev"));
app.use(require("express").json());

app.use("/api", userRoute);
app.use("/api", authMiddleware, articleRoute);
app.use("/api", authMiddleware, commentRoute);
app.use("/api", authMiddleware, tagRoute);
app.use("*", (req, res, next) => res.json(response(404)));
app.use((req, res, next) => res.json(response(500)));

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
