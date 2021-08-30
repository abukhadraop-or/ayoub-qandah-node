/**
 * Response function.
 *
 * @param {Number} code -Status of HTTP request.
 * @param {object} data -Data from response.
 * @param {string} msg -Message.
 *
 * @return {{msg, code, data}|*}
 */
module.exports = (data, code = 200, msg = 'Ok') => {
  const res = { code, msg };
  if (data) {
    res.data = data;
  }
  return res;
};
