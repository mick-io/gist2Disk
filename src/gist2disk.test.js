const fs = require('fs');
const assert = require('assert');
const mocha = require('mocha');
const gist2Disk = require('./gist2disk');

mocha.describe('gist2Disk', async () => {
  const username = 'mick-io';
  const description = 'gist2Disk Testing Gist';
  const dirPath = __dirname;
  const filePath = `${dirPath}/testing-gist.txt`;
  const testMessage = 'This is a test message for gist2Disk.';

  mocha.before(() => {
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      /* Left Blank Intentionally */
    }
  });

  mocha.it(
    'It should obtain gists data from the Github API & write it to disk',
    async () => {
      await gist2Disk({ username, description, dirPath });
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      assert.strictEqual(fileContent, testMessage);
    },
  );

  mocha.after(() => {
    fs.unlinkSync(filePath);
  });
});
