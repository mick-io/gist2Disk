const util = require('util');
const fs = require('fs');
const axios = require('axios');
const config = require('./config');
const path = require('path');
const { getFileExtension, errorChecks } = require('./utilities');

/**
 * Writes the files within a Github Gist to the specified file path.
 * @param { username: string, description: string, path: string } parameters: Inputs described below
 * @param { string } parameters.username: The Github username of the Gist owner
 * @param { string } parameters.description: The description of the Gist.
 * @param { string } parameters.dirPath: The directory path that the will be written to.
 */
module.exports = async function(parameters) {
  errorChecks(parameters);
  const writeToDisk = util.promisify(fs.writeFile);
  const { username, description, dirPath } = parameters;

  try {
    const response = await axios.get(config.gistApi(username));
    const gist = findDescribedGist(response.data);
    const readWritePromises = startReadWrite(gist.files);
    await Promise.all(readWritePromises);
  } catch (error) {
    throw error;
  }

  /**
   * Iterators over an array of objects.
   * Returns when an object with a property of description matches the description parameter.
   * @param { object[] } gists: An Array of objects containing the metadata for all the user's gist
   */
  function findDescribedGist(gists) {
    for (const gist of gists) {
      if (gist.description === description) {
        return gist;
      }
    }
    throw new Error(config.noDescriptionError(description));
  }

  /**
   * Iterates over the keys in a object
   * Each iteration creates a promise for reading from a url and writing to disk
   * returns an array of promises
   * @param { object } files: An Object of sub-objects that contains the metadata for each file in the gist
   * file: { filename:string, type: string, language: string, raw_url: string, size: number }
   */
  function startReadWrite(files) {
    const promises = [];
    for (const key in files) {
      const dataUrl = files[key].raw_url;
      const filePath = path.join(dirPath, key);
      const readWritePromise = readWriteData(dataUrl, filePath);
      promises.push(readWritePromise);
    }
    return promises;
  }

  /**
   * Calls the Github API and gets raw text from a gist
   * returns a promise to write that text to disk.
   * @param { string } url: The url for the raw data that will be stringified and written to disk
   * @param { string } filePath: The file path that will be written to.
   */
  async function readWriteData(url, filePath) {
    const isJSON = getFileExtension(filePath) === 'json';
    try {
      const response = await axios.get(url);
      const data = isJSON ? JSON.stringify(response.data, undefined, 2) : response.data;
      return writeToDisk(filePath, data);
    } catch (error) {
      throw error;
    }
  }
};
