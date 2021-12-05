"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findFromData = exports.getEntriesWithPath = exports.getQuestionsList = exports.getOutputFormat = exports.getOutputPath = exports.getConfig = exports.getContent = void 0;

// keeping config data model access consistent

/**
 * @typedef {import('./types').AppConfig} AppConfig
 * @typedef {import('./types').ContentOption} ContentOption
 */

/** @param {AppConfig} config AppConfig */
const getContent = config => config.content;
/** @param {AppConfig} config AppConfig */


exports.getContent = getContent;

const getConfig = config => config.config;
/** @param {AppConfig} config AppConfig */


exports.getConfig = getConfig;

const getOutputPath = config => getConfig(config).output;
/** @param {AppConfig} config AppConfig */


exports.getOutputPath = getOutputPath;

const getOutputFormat = config => config.outputFormat;
/** @param {AppConfig} config AppConfig */


exports.getOutputFormat = getOutputFormat;

const getQuestionsList = config => getContent(config).filter(entry => 'questions' in entry);
/** @param {AppConfig} config AppConfig */


exports.getQuestionsList = getQuestionsList;

const getEntriesWithPath = config => getContent(config).filter(entry => 'path' in entry);
/**
 * @param {string} choice
 * @param {AppConfig} userData
 */


exports.getEntriesWithPath = getEntriesWithPath;

const findFromData = (choice, userData) => getContent(userData).find(data => data.name === choice);

exports.findFromData = findFromData;