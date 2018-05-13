const fs = require('fs');
const assert = require('assert');
const util = require('util');
const mocha = require('mocha');
const gist2Disk = require('./app');
const config = require('./config');

mocha.describe('gist2Disk', async () => {
  const deleteFile = util.promisify(fs.unlink);
  const readFile = util.promisify(fs.readFile);
  const username = 'mick-io';
  const description = 'gist2disk-testing-gist';
  const dirPath = __dirname;
  const textFilePath = `${dirPath}/testing-text.txt`;
  const jsonFilePath = `${dirPath}/testing-json.json`;
  const testString = 'This is a test message for gist2Disk.';
  const testObject = { Testing: 123 };
  const throwsErrorCheck = async function(parameters, expectedError) {
    try {
      assert.throws(await gist2Disk(parameters), Error);
    } catch (error) {
      assert.strictEqual(error.message, expectedError);
      return;
    }
  };

  mocha.before(async () => {
    try {
      await Promise.all([deleteFile(textFilePath), deleteFile(jsonFilePath)]);
    } catch (error) {
      return;
    }
  });

  // eslint-disable-next-line
  mocha.it("obtains a gist's data from the Github API & write all it's files to disk", async () => {
    try {
      await gist2Disk({ username, description, dirPath });
      const readTextPromise = readFile(textFilePath);
      const readJsonPromise = readFile(jsonFilePath);
      const [encodedText, encodedJson] = await Promise.all([readTextPromise, readJsonPromise]);
      assert.strictEqual(encodedText.toString(), testString);
      assert.strictEqual(JSON.parse(encodedJson).testing, testObject.testing);
    } catch (error) {
      throw error;
    }
  });

  mocha.it('throws an error when parameters are missing', async () => {
    const promises = [];
    [
      { username, description },
      { description, dirPath },
      { dirPath, username },
      { username },
      { dirPath },
      { description },
      {},
    ].map(parameters => {
      promises.push(throwsErrorCheck(parameters, config.isUndefinedError));
    });
    await Promise.all(promises);
  });

  mocha.it('throws an error when no gist with the description is found', async () => {
    const faultyDescription = 'Invalid gist description';
    const expectedError = config.noDescriptionError(faultyDescription);
    const faultyParams = {
      username,
      description: faultyDescription,
      dirPath,
    };
    await throwsErrorCheck(faultyParams, expectedError);
  });

  mocha.after(async () => {
    await Promise.all([deleteFile(textFilePath), deleteFile(jsonFilePath)]);
  });
});
