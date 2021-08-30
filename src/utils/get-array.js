/**
 * To make the array from db more simple.
 *
 * @param {value} value Array of Object.
 *
 * @returns {Array} Get Array value data.
 */
function getArray(value) {
  return value.map((e) => e.dataValues);
}
module.exports = { getArray };
