import fs from 'fs';
import os from 'os';
import path from 'path';

const { promises } = fs;

/** @typedef {string} BashFilePath absolute file path (can include '~') */
/** @typedef {string} ExpandedPath absolute file path */

export const readFileAsync = promises.readFile;
export const writeFileAsync = promises.writeFile;

/**
 * Checks if a file or directory exists
 * @param {string} inputPath file or directory path
 * @returns {Promise<boolean>} exists or not
 */
export const existsAsync = async inputPath => {
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
const expandHome = filepath => {
  if (filepath[0] === '~') {
    return path.join(os.homedir(), filepath.slice(1));
  }
  return filepath;
};

/**
 * @param {BashFilePath} filePath path of file or directory
 * @returns {ExpandedPath} expanded path
 */
export const resolvePath = filePath => path.resolve(expandHome(filePath));

/**
 * @param {string} filepath path of file or directory: ie 'path/to/index.html'
 * @returns {string} filename without directory: ie 'index.html'
 */
export const getFileName = filepath => path.basename(filepath);

/**
 * @param {BashFilePath} backupDir backup directory
 * @param {BashFilePath} filepath path of file or directory
 * @returns {ExpandedPath} backup file location
 */
export const getBackupFileLocation = (backupDir, filepath) => {
  const fileName = getFileName(filepath);
  const resolvedDir = resolvePath(backupDir);
  return path.join(resolvedDir, fileName);
};

/**
 * This does more than fs.copyFile.
 * It allows for '~' in paths and creates a new path for the backup file location.
 * @param {BashFilePath} fileToCopy path of file or directory
 * @param {BashFilePath} backupDirAbsolute backup directory
 * @returns {Promise<void>} resolves with what copyFileAsync returns
 */
export const copyFileAsync = (fileToCopy, backupDirAbsolute) => {
  const absFilePath = resolvePath(fileToCopy);
  return promises.copyFile(
    absFilePath,
    getBackupFileLocation(backupDirAbsolute, absFilePath)
  );
};
