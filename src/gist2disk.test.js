const fs = require('fs');
const assert = require('assert');
const { it, before, describe, after } = require('mocha');
const gist2Disk = require('./gist2disk');
const config = require('./config');

describe('gist2Disk', async () => {
  const username = 'mick-io';
  const description = 'gist2Disk Testing Gist';
  const dirPath = __dirname;
  const filePath = `${dirPath}/testing-gist.txt`;
  const testMessage = 'This is a test message for gist2Disk.';

  before(() => {
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      return;
    }
  });

  // eslint-disable-next-line
  it("obtains a gist's data from the Github API & write it to disk", async () => {
    try {
      await gist2Disk({ username, description, dirPath });
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      assert.strictEqual(fileContent, testMessage);
    } catch (error) {
      throw error;
    }
  });

  it('throws an error when a parameter is missing', async () => {
    try {
      assert.throws(
        await gist2Disk({ username, description }),
        config.isUndefinedError,
      );
    } catch (error) {
      assert.strictEqual(error.message, config.isUndefinedError);
      return;
    }
  });

  it('throws an error when no gist with the description is found', async () => {
    const faultyDescription = 'Invalid gist description';
    const faultyParams = {
      username,
      description: faultyDescription,
      dirPath,
    };

    try {
      assert.throws(await gist2Disk(faultyParams), Error);
    } catch (error) {
      assert.strictEqual(
        error.message,
        config.noDescriptionError(faultyDescription),
      );
      return;
    }
  });

  after(() => {
    fs.unlinkSync(filePath);
  });
});
