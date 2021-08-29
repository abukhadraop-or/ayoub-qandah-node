const { NotFound, InternalError } = require('../middleware/error-handler');

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
module.exports = (data, code = 200, msg = 'Ok') => {
  if (code === 404) return new NotFound();
  if (code === 500) return new InternalError();

  return { code, data, msg };
};
