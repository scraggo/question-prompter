"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openConfigWithVSCode = exports.openWithVSCode = void 0;

var _child_process = require("child_process");

var _fs = require("./fs");

/**
 * @param {string} filePath file path
 * @param {string} cmd command
 * @returns {Promise<Buffer>} result of child_process.execSync
 */
const openWith = (filePath, cmd) => {
  const resolvedPath = (0, _fs.resolvePath)(filePath);
  return (0, _fs.existsAsync)(resolvedPath).then(() => (0, _child_process.execSync)(`${cmd} ${resolvedPath}`));
};
/**
 * @param {string} filePath file path
 * @returns {Promise<Buffer>} result of openWith
 */


const openWithVSCodeBare = filePath => openWith(filePath, 'code'); // todo: allow to open with 'default' or user specified other

/**
 * @param {string} filePath filePath
 */


const openWithVSCode = filePath => {
  return openWithVSCodeBare(filePath).catch(err => {
    console.error(err);
  });
};
/**
 * @param {string} filePath filePath
 */


exports.openWithVSCode = openWithVSCode;

const openConfigWithVSCode = filePath => openWithVSCodeBare(filePath).catch(err => {
  console.error('The "path" specified in config file wasn\'t found.');
  console.error(err.message);
});

exports.openConfigWithVSCode = openConfigWithVSCode;