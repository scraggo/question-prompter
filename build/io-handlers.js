"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.writeQAToOutputDir = exports.convertQAOutput = exports.createFileName = exports.getConfig = void 0;

var _dateFns = require("date-fns");

var _jsYaml = _interopRequireDefault(require("js-yaml"));

var _fs = require("./utils/fs");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const parseConfigFile = configPath => {
  if (configPath.endsWith('json')) {
    return JSON.parse;
  }

  if (configPath.endsWith('yaml')) {
    return _jsYaml.default.safeLoad;
  }

  throw new Error(`unknown extension type, ${configPath}`);
};

const getConfig = commander => {
  // config is required, or we don't get to this point
  const {
    config,
    outputFormat = 'json'
  } = commander;
  const configPath = (0, _fs.resolvePath)(config);
  return (0, _fs.existsAsync)(configPath).then(() => (0, _fs.readFileAsync)(configPath, {
    encoding: 'utf8'
  })).then(configFileText => {
    const parsed = parseConfigFile(configPath)(configFileText);
    parsed.outputFormat = outputFormat;
    return parsed;
  });
};
/**
 * Filenames will be unique once per second
 * @param {string} choice result
 * @param {string} dir from config
 * @returns {string} BackupFileLocation
 */


exports.getConfig = getConfig;

const createFileName = (choice, dir, {
  extension
} = {}) => {
  const d = Date.now();
  const fileName = `${(0, _dateFns.format)(d, 'yyMMdd_HHmmss')}_${choice}.${extension}`;
  return (0, _fs.getBackupFileLocation)(dir, fileName);
};

exports.createFileName = createFileName;

const convertQAOutput = (choice, answersToQs, {
  extension
} = {}) => {
  const outputData = {
    name: choice,
    entries: answersToQs
  };

  if (extension === 'json') {
    return JSON.stringify(outputData, null, 2);
  }

  if (extension === 'yaml') {
    // lineWidth -1: disable wrapping of long lines
    return _jsYaml.default.safeDump(outputData, {
      lineWidth: -1
    });
  }

  throw new Error(`unknown extension type, ${extension}`);
};

exports.convertQAOutput = convertQAOutput;

const writeQAToOutputDir = async ({
  choice,
  dir,
  extension,
  text
}) => {
  try {
    let filePath = createFileName(choice, dir, {
      extension
    });
    const exists = await (0, _fs.existsAsync)(filePath);

    if (!exists) {
      (0, _fs.writeFileAsync)(filePath, text, 'utf8');
      return filePath;
    }

    console.log('Waiting...'); // retry after 1.2 seconds for unique filename

    await new Promise(resolve => setTimeout(resolve, 1200));
    filePath = createFileName(choice, dir, {
      extension
    });
    (0, _fs.writeFileAsync)(filePath, text, 'utf8');
    return filePath;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

exports.writeQAToOutputDir = writeQAToOutputDir;