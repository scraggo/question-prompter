"use strict";

var _commander = _interopRequireDefault(require("./commander"));

var _ioHandlers = require("./io-handlers");

var _inquirer = _interopRequireDefault(require("./inquirer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const main = () => (0, _ioHandlers.getConfig)(_commander.default).then(config => {
  return (0, _inquirer.default)(config);
});

main();