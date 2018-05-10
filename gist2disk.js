#!/usr/bin/env node
const gist2Disk = require('./src/app');

let [, , username, description, dirPath] = process.argv;

if (!dirPath) {
  dirPath = __dirname;
}

const params = { username, description, dirPath };

gist2Disk(params).then(() => process.exit(0));
