const { NotFound, InternalError } = require("../middleware/errorhandling");

/**
 * Response function.
 * Check if the code 404 or 500 to run global Error.
 *
 * @param {Number} code -Status of HTTP request.
 * @param {object} data -Data from response.
 * @param {string} msg -Message.
 *
 * @return {{msg, code, data}|*}
 */
module.exports = (code, data, msg) => {
  if (code === 404) return new NotFound();
  if (code === 500) return new InternalError();

  return { code, data, msg };
};
