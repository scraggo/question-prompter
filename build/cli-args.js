"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _commander = _interopRequireDefault(require("commander"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getCLIArgs = () => _commander.default.version('0.0.1').requiredOption('-c, --config <path>', 'Path to config file (JSON or YAML').option('-o, --outputFormat <format>', 'json (default) | yaml').parse(process.argv);

var _default = getCLIArgs;
exports.default = _default;