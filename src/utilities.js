const util = require('util');
const config = require('./config');

/**
 * Throws an error if any of the inputs undefined or not of type string.
 * @param {string} parameter: One of the expected input parameters.
 */
exports.errorCheck = function(parameter) {
  if (util.isUndefined(parameter)) {
    throw new Error(config.isUndefinedError);
  }

  if (!util.isString(parameter)) {
    throw new Error(config.isNotStringError);
  }
};
