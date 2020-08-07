"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _inquirer = _interopRequireDefault(require("inquirer"));

var _exec = require("./utils/exec");

var _ioHandlers = require("./io-handlers");

var selectors = _interopRequireWildcard(require("./data/selectors"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; if (obj != null) { var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class InquirerWrapper {
  constructor(config) {
    this.config = config;
    this.prompts = {
      answerQuestions: {
        name: 'Answer questions',
        value: 'answerQuestions',
        cb: this.answerQuestionsCallback.bind(this)
      },
      lookAtNotes: {
        name: 'Look at notes',
        value: 'lookAtNotes',
        cb: this.lookAtNotesCallback.bind(this)
      },
      whichNote: [{
        type: 'list',
        name: 'whichNote',
        message: 'What note do you want to read?',
        choices: selectors.getEntriesWithPath(this.config)
      }],
      whichQuestions: [{
        type: 'list',
        name: 'whichQuestions',
        message: 'Which questions do you want to answer?',
        choices: selectors.getQuestionsList(this.config)
      }],
      openFile: [{
        type: 'list',
        name: 'openFile',
        message: 'Want to open your questions file?',
        choices: InquirerWrapper.mapToInquirer(['Yes', 'No'])
      }]
    };
    this.prompts.topLevel = [{
      type: 'list',
      name: 'topLevel',
      message: 'What do you want to do?',
      choices: [this.prompts.answerQuestions, this.prompts.lookAtNotes]
    }];
  }
  /**
   * @param {Array<string|Object>} questions if {string}, simple format
   * @returns {Array<Object>} questions mapped to inquirer format
   */


  static mapToInquirer(questions) {
    return questions.map(q => typeof q === 'string' ? {
      name: q
    } : q);
  }

  async main() {
    const answers = await _inquirer.default.prompt(this.prompts.topLevel);
    const choice = answers.topLevel;
    return this.prompts[choice].cb();
  }

  getEntryQuestions(choice) {
    const {
      questions
    } = selectors.findFromData(choice, this.config);
    return InquirerWrapper.mapToInquirer(questions);
  }

  async answerQuestionsCallback() {
    const prompt = await _inquirer.default.prompt(this.prompts.whichQuestions);
    const choice = prompt.whichQuestions;
    const questions = this.getEntryQuestions(choice);
    const answers = await _inquirer.default.prompt(questions);
    const extension = selectors.getOutputFormat(this.config);
    const filePath = await (0, _ioHandlers.writeQAToOutputDir)({
      choice,
      dir: selectors.getOutputPath(this.config),
      extension,
      text: (0, _ioHandlers.convertQAOutput)(choice, answers, {
        extension
      })
    });
    console.log('Successfully saved to', filePath);
    const openFile = await _inquirer.default.prompt(this.prompts.openFile);

    if (openFile.openFile === 'Yes') {
      console.log('Opening...');
      (0, _exec.openWithVSCode)(filePath);
    } else {
      console.log('Exiting.');
    }
  }

  async lookAtNotesCallback() {
    const prompt = await _inquirer.default.prompt(this.prompts.whichNote);
    const choice = prompt.whichNote;
    const noteToView = selectors.findFromData(choice, this.config).path;
    console.log(`Opening ${noteToView}...`);
    (0, _exec.openConfigWithVSCode)(noteToView);
  }

}

var _default = config => new InquirerWrapper(config).main();

exports.default = _default;