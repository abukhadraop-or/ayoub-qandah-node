/**
 * Response function.
 *
 * @param {Number} code -Status of HTTP request.
 * @param {object} data -Data from response.
 * @param {string} msg -Message.
 *
 * @return {{msg, code, data}|*}
 */
module.exports = (data, code = 200, msg) => {
  const res = { code, msg: msg || 'Ok' };
  if (data) {
    res.data = data;
  }
  return res;
};
