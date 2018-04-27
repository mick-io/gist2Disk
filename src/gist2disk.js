const fs = require("fs");
const path = require("path");
const util = require("util");
const axios = require("axios");

module.exports = async function(username, description, rootPath) {
  if (!util.isString(username) || !util.isString(description)) {
    throw new Error("Inputs must be of type string!");
  }

  const writeToDisk = util.promisify(fs.writeFile);
  const apiUrl = `https://api.github.com/users/${username}/gists`;

  try {
    const response = await axios.get(apiUrl);
    const gist = findDescribedGist(response.data);
    const readWritePromises = startReadWrite(gist.files);
    await Promise.all(readWritePromises);
    debugger;
  } catch (error) {
    throw error;
  }

  /**
   * Iterators over an array of objects.
   * Returns when an object with a property of description matches the description parameter.
   * @param {object[]} gists
   */
  function findDescribedGist(gists) {
    for (const gist of gists) {
      if (gist.description === description) {
        return gist;
      }
    }
    throw new Error(`Gist described as "${description}" not found!`);
  }

  /**
   * Iterates over the keys in a object
   * Each iteration creates a promise for reading from a url and writing to disk
   * returns an array of promises
   * @param {object} files
   */
  function startReadWrite(files) {
    const promises = [];
    for (const key in files) {
      const dataUrl = files[key].raw_url;
      const filePath = path.join(rootPath, key);
      const readWritePromise = readWriteData(dataUrl, filePath);
      promises.push(readWritePromise);
    }
    return promises;
  }

  /**
   * Calls the Github API and gets raw text from a gist
   * returns a promise to write that text to disk.
   * @param {string} url
   * @param {string} filePath
   */
  async function readWriteData(url, filePath) {
    try {
      const response = await axios.get(url);
      const data = JSON.stringify(response.data);
      return writeToDisk(filePath, data, "utf-8");
    } catch (error) {
      throw error;
    }
  }
};
