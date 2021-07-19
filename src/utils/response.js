const { notFound ,internalError } = require("../middleware/errorhandling");

module.exports = (code, data, msg) => {
  // eslint-disable-next-line new-cap
  if (code === 404) return new notFound();

  // eslint-disable-next-line new-cap
  if (code === 500) return new internalError();

  return { code, data, msg };
};
