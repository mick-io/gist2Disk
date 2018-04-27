const gist2Disk = require("./src/gist2disk");

const [, , githubUsername, gistDescription] = process.argv;

(async function() {
  await gist2Disk(githubUsername, gistDescription, __dirname);
  process.exit(0);
})();
