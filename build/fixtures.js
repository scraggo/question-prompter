"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.appConfigExample = exports.appConfigMinimal = void 0;

var _example = _interopRequireDefault(require("./example/example.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const appConfigMinimal = {
  outputFormat: 'json',
  config: {
    output: '.'
  },
  content: []
};
exports.appConfigMinimal = appConfigMinimal;
const appConfigExample = _example.default;
exports.appConfigExample = appConfigExample;