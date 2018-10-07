const Promise = require('bluebird');
const cli = require('node-cmd');

const exec = Promise.promisify(cli.get, { multiArgs: true, context: cli });

const terminalExec = async command => exec(command);

module.exports = { terminalExec };