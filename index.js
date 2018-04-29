const gist2Disk = require('./src/gist2disk');

const [, , username, description, dirPath] = process.argv;
const params = { username, description, dirPath };

gist2Disk(params).then(() => process.exit(0));
