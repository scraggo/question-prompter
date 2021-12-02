import { format } from 'date-fns';
import yaml from 'js-yaml';

import {
  existsAsync,
  getBackupFileLocation,
  readFileAsync,
  resolvePath,
  writeFileAsync
} from './utils/fs';

/**
 * @typedef {import('./types').CLIArgs} CLIArgs
 * @typedef {import('./types').AppConfig} AppConfig
 */

/**
 * @param {string} configPath string
 * @returns {function} parser function
 */
const getConfigFileParser = configPath => {
  if (configPath.endsWith('json')) {
    return JSON.parse;
  }
  if (configPath.endsWith('yaml')) {
    return yaml.safeLoad;
  }
  throw new Error(`unknown extension type, ${configPath}`);
};

/**
 * @param {CLIArgs} commander CLI arguments
 * @returns {Promise<AppConfig>} AppConfig
 */
export const getConfig = async commander => {
  // config is required, or we don't get to this point
  const { config, outputFormat = 'json' } = commander;
  const configPath = resolvePath(config);
  await existsAsync(configPath);
  const configFileText = await readFileAsync(configPath, { encoding: 'utf8' });
  const parsed = getConfigFileParser(configPath)(configFileText);
  parsed.outputFormat = outputFormat;
  return parsed;
};

/**
 * Filenames will be unique once per second
 * @param {string} choice result
 * @param {string} dir from config
 * @param {Object} [options={}] from config
 * @param {string} [options.extension] allowed extension, ex: 'yaml'
 * @returns {string} BackupFileLocation
 */
export const createFileName = (choice, dir, { extension } = {}) => {
  const d = Date.now();
  const fileName = `${format(d, 'yyMMdd_HHmmss')}_${choice}.${extension}`;
  return getBackupFileLocation(dir, fileName);
};

/**
 * @param {*} choice
 * @param {*} answersToQs
 * @param {Object} [options] from config
 * @param {string} [options.extension] allowed extension, ex: 'yaml'
 * @returns
 */
export const convertQAOutput = (choice, answersToQs, { extension } = {}) => {
  const outputData = {
    name: choice,
    entries: answersToQs
  };

  if (extension === 'json') {
    return JSON.stringify(outputData, null, 2);
  }
  if (extension === 'yaml') {
    // lineWidth -1: disable wrapping of long lines
    return yaml.safeDump(outputData, { lineWidth: -1 });
  }
  throw new Error(`unknown extension type, ${extension}`);
};

/**
 * @param {Object} options from config
 * @param {string} [options.extension] allowed extension, ex: 'yaml'
 * @param {*} [options.choice] todo
 * @param {*} [options.dir] todo
 * @param {*} [options.text] todo
 */
export const writeQAToOutputDir = async ({ choice, dir, extension, text }) => {
  try {
    let filePath = createFileName(choice, dir, { extension });
    const exists = await existsAsync(filePath);
    if (!exists) {
      writeFileAsync(filePath, text, 'utf8');
      return filePath;
    }
    console.log('Waiting...');
    // retry after 1.2 seconds for unique filename
    await new Promise(resolve => setTimeout(resolve, 1200));
    filePath = createFileName(choice, dir, { extension });
    writeFileAsync(filePath, text, 'utf8');
    return filePath;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
