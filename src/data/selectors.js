// keeping config data model access consistent

export const getContent = config => config.content;
export const getConfig = config => config.config;
export const getOutputPath = config => getConfig(config).output;
export const getOutputFormat = config => config.outputFormat;

export const getQuestionsList = config =>
  getContent(config).filter(entry => Boolean(entry.questions));

export const getEntriesWithPath = config =>
  getContent(config).filter(entry => Boolean(entry.path));

export const findFromData = (choice, userData) =>
  getContent(userData).find(data => data.name === choice);
