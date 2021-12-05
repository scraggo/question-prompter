"use strict";

var _cliArgs = _interopRequireDefault(require("./cli-args"));

var _ioHandlers = require("./io-handlers");

var _prompter = require("./prompter");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const main = async () => {
  const {
    config,
    outputFormat
  } = (0, _cliArgs.default)();
  const appConfig = await (0, _ioHandlers.getConfig)({
    config,
    outputFormat
  });
  return new _prompter.Prompter(appConfig).main();
};

main();