import commander from 'commander';

const getCLIArgs = () =>
  commander
    .version('0.0.1')
    .requiredOption('-c, --config <path>', 'Path to config file (JSON or YAML')
    .option('-o, --outputFormat <format>', 'json (default) | yaml')
    .parse(process.argv);

export default getCLIArgs;
