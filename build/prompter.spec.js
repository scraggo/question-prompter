"use strict";

var _chai = require("chai");

var _sinon = _interopRequireDefault(require("sinon"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _prompter = require("./prompter");

var fixtures = _interopRequireWildcard(require("./fixtures"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_sinon.default.stub(_inquirer.default);

describe('prompter - Prompter class', () => {
  it('initializes with a config', () => {
    // @ts-ignore
    const getInitialized = () => new _prompter.Prompter(fixtures.appConfigMinimal);

    (0, _chai.expect)(getInitialized).not.to.throw();
  });
});