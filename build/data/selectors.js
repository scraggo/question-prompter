"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findFromData = exports.getEntriesWithPath = exports.getQuestionsList = exports.getOutputFormat = exports.getOutputPath = exports.getConfig = exports.getContent = void 0;

// keeping config data model access consistent
const getContent = config => config.content;

exports.getContent = getContent;

const getConfig = config => config.config;

exports.getConfig = getConfig;

const getOutputPath = config => getConfig(config).output;

exports.getOutputPath = getOutputPath;

const getOutputFormat = config => config.outputFormat;

exports.getOutputFormat = getOutputFormat;

const getQuestionsList = config => getContent(config).filter(entry => Boolean(entry.questions));

exports.getQuestionsList = getQuestionsList;

const getEntriesWithPath = config => getContent(config).filter(entry => Boolean(entry.path));

exports.getEntriesWithPath = getEntriesWithPath;

const findFromData = (choice, userData) => getContent(userData).find(data => data.name === choice);

exports.findFromData = findFromData;