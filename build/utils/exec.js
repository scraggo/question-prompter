"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.openConfigWithVSCode = exports.openWithVSCode = void 0;

var _child_process = require("child_process");

var _fs = require("./fs");

const openWith = (filePath, cmd) => {
  const resolvedPath = (0, _fs.resolvePath)(filePath);
  return (0, _fs.existsAsync)(resolvedPath).then(() => (0, _child_process.execSync)(`${cmd} ${resolvedPath}`));
};

const openWithVSCodeBare = filePath => openWith(filePath, 'code'); // todo: allow to open with 'default' or user specified other


const openWithVSCode = filePath => {
  return openWithVSCodeBare(filePath).catch(err => {
    console.error(err);
  });
};

exports.openWithVSCode = openWithVSCode;

const openConfigWithVSCode = filePath => openWithVSCodeBare(filePath).catch(err => {
  console.error('The "path" specified in config file wasn\'t found.');
  console.error(err.message);
});

exports.openConfigWithVSCode = openConfigWithVSCode;