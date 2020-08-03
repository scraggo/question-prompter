import commander from './commander';
import { getConfig } from './io-handlers';
import inquirer from './inquirer';

const main = () =>
  getConfig(commander).then(config => {
    return inquirer(config);
  });

main();
