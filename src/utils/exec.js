import { execSync } from 'child_process';
import { existsAsync, resolvePath } from './fs';

/**
 * @param {string} filePath file path
 * @param {string} cmd command
 * @returns {Promise<Buffer>} result of child_process.execSync
 */
const openWith = (filePath, cmd) => {
  const resolvedPath = resolvePath(filePath);
  return existsAsync(resolvedPath).then(() =>
    execSync(`${cmd} ${resolvedPath}`)
  );
};

/**
 * @param {string} filePath file path
 * @returns {Promise<Buffer>} result of openWith
 */
const openWithVSCodeBare = filePath => openWith(filePath, 'code');

// todo: allow to open with 'default' or user specified other
/**
 * @param {string} filePath filePath
 */
export const openWithVSCode = filePath => {
  return openWithVSCodeBare(filePath).catch(err => {
    console.error(err);
  });
};

/**
 * @param {string} filePath filePath
 */
export const openConfigWithVSCode = filePath =>
  openWithVSCodeBare(filePath).catch(err => {
    console.error('The "path" specified in config file wasn\'t found.');
    console.error(err.message);
  });
