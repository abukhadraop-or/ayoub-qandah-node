const cors = require("cors");
const morgan = require("morgan");
const app = require("express")();
const tagRoute = require("./routes/tag");
const userRoute = require("./routes/user");
const response = require("./utils/response");
const articleRoute = require("./routes/article");
const commentRoute = require("./routes/comment");

app.use(cors());
app.use(morgan("dev"));
app.use(require("express").json());

/**
 * All app routes.
 * Run authentication to specific routes.
 */
app.use("/api", tagRoute);
app.use("/api", userRoute);
app.use("/api", articleRoute);
app.use("/api", commentRoute);

/**
 * Not Found Error & Internal Error.
 */
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
