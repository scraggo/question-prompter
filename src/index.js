import getCLIArgs from './cli-args';
import { getConfig } from './io-handlers';
import { Prompter } from './prompter';

const main = async () => {
  const { config, outputFormat } = getCLIArgs();
  const appConfig = await getConfig({ config, outputFormat });
  return new Prompter(appConfig).main();
};

main();
