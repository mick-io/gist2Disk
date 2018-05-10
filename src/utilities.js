const util = require('util');
const path = require('path');
const config = require('./config');

// TODO: Add Tilda support

/**
 * Returns the file extension of any given path.
 * @param {string} filePath: The path with the desired file extension
 */
exports.getFileExtension = function(filePath) {
  return filePath
    .split('.')
    .pop()
    .toLowerCase();
};

/**
 * Checks the input parameters for errors
 * @param { username: string, description: string, dirPath: string } parameters
 */
exports.errorChecks = function(parameters) {
  const { username, description, dirPath } = parameters;
  valueCheck(username);
  valueCheck(description);
  valueCheck(dirPath);
  tildaCheck(dirPath);
  createAbsolutePath(dirPath);
};

/**
 * Throws an error if any of the inputs undefined or not of type string.
 * @param { string } parameter: One of the expected input parameters.
 */
function valueCheck(parameter) {
  if (util.isUndefined(parameter)) {
    throw new Error(config.isUndefinedError);
  }

  if (!util.isString(parameter)) {
    throw new Error(config.isNotStringError);
  }
}

/**
 *  Throws an error if the file path includes a tilda
 * @param { string } dirPath: The directory path to be error checked.
 */
function tildaCheck(dirPath) {
  if (dirPath.includes('~')) {
    throw new Error(config.tildaUseError);
  }
}

/**
 * Returns the if a relative path is input.
 * @param { string } dirPath: The path in which an absolute path will be returned.
 */
function createAbsolutePath(dirPath) {
  return path.isAbsolute(dirPath) ? dirPath : path.resolve(dirPath);
}
