#!/usr/bin/env node
const gist2Disk = require('./src/app');
const os = require('os');

let [, , username, description, dirPath] = process.argv;

dirPath = !dirPath ? __dirname : dirPath.replace('~', os.homedir());

const params = { username, description, dirPath };

gist2Disk(params).then(() => process.exit(0));
