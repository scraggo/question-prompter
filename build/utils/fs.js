"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.copyFileAsync = exports.getBackupFileLocation = exports.getFileName = exports.resolvePath = exports.existsAsync = exports.writeFileAsync = exports.readFileAsync = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _os = _interopRequireDefault(require("os"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  promises
} = _fs.default;
/** @typedef {string} BashFilePath absolute file path (can include '~') */

/** @typedef {string} ExpandedPath absolute file path */

const readFileAsync = promises.readFile;
exports.readFileAsync = readFileAsync;
const writeFileAsync = promises.writeFile;
/**
 * Checks if a file or directory exists
 * @param {string} inputPath file or directory path
 * @returns {Promise<boolean>} exists or not
 */

exports.writeFileAsync = writeFileAsync;

const existsAsync = async inputPath => {
  try {
    await promises.access(inputPath);
    return true;
  } catch (error) {
    return false;
  }
};
/**
 * If path begins with '~', turn into an absolute path
 * @param {BashFilePath} filepath path of file or directory
 * @returns {ExpandedPath} expanded path
 */


exports.existsAsync = existsAsync;

const expandHome = filepath => {
  if (filepath[0] === '~') {
    return _path.default.join(_os.default.homedir(), filepath.slice(1));
  }

  return filepath;
};
/**
 * @param {BashFilePath} filePath path of file or directory
 * @returns {ExpandedPath} expanded path
 */


const resolvePath = filePath => _path.default.resolve(expandHome(filePath));
/**
 * @param {string} filepath path of file or directory: ie 'path/to/index.html'
 * @returns {string} filename without directory: ie 'index.html'
 */


exports.resolvePath = resolvePath;

const getFileName = filepath => _path.default.basename(filepath);
/**
 * @param {BashFilePath} backupDir backup directory
 * @param {BashFilePath} filepath path of file or directory
 * @returns {ExpandedPath} backup file location
 */


exports.getFileName = getFileName;

const getBackupFileLocation = (backupDir, filepath) => {
  const fileName = getFileName(filepath);
  const resolvedDir = resolvePath(backupDir);
  return _path.default.join(resolvedDir, fileName);
};
/**
 * This does more than fs.copyFile.
 * It allows for '~' in paths and creates a new path for the backup file location.
 * @param {BashFilePath} fileToCopy path of file or directory
 * @param {BashFilePath} backupDirAbsolute backup directory
 * @returns {Promise<void>} resolves with what copyFileAsync returns
 */


exports.getBackupFileLocation = getBackupFileLocation;

const copyFileAsync = (fileToCopy, backupDirAbsolute) => {
  const absFilePath = resolvePath(fileToCopy);
  return promises.copyFile(absFilePath, getBackupFileLocation(backupDirAbsolute, absFilePath));
};

exports.copyFileAsync = copyFileAsync;