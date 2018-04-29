const gist2Disk = require('./src/gist2disk');

const [, , username, description, path] = process.argv;
const params = { username, description, path };

gist2Disk(params).then(() => process.exit(0));
