// keeping config data model access consistent

/**
 * @typedef {import('./types').AppConfig} AppConfig
 * @typedef {import('./types').ContentOption} ContentOption
 */

/** @param {AppConfig} config AppConfig */
export const getContent = config => config.content;
/** @param {AppConfig} config AppConfig */
export const getConfig = config => config.config;
/** @param {AppConfig} config AppConfig */
export const getOutputPath = config => getConfig(config).output;
/** @param {AppConfig} config AppConfig */
export const getOutputFormat = config => config.outputFormat;

/** @param {AppConfig} config AppConfig */
export const getQuestionsList = config =>
  getContent(config).filter(entry => 'questions' in entry);

/** @param {AppConfig} config AppConfig */
export const getEntriesWithPath = config =>
  getContent(config).filter(entry => 'path' in entry);

/**
 * @param {string} choice
 * @param {AppConfig} userData
 */
export const findFromData = (choice, userData) =>
  getContent(userData).find(data => data.name === choice);
