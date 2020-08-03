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

/**
 * @param {Array<string|Object>} questions if {string}, simple format
 * @returns {Array<Object>} questions mapped to inquirer format
 */
const mapToInquirer = questions => questions.map(q => {
  if (typeof q === 'string') {
    return {
      name: q
    };
  }

  return q;
});

const getEntryQuestions = (choice, userData) => {
  const {
    questions
  } = selectors.findFromData(choice, userData);
  return mapToInquirer(questions);
};

const secondLevel = {
  answerQuestions: {
    name: 'Answer questions',
    value: 'answerQuestions',
    cb: async userData => {
      const prompt = await _inquirer.default.prompt([{
        type: 'list',
        name: 'whichQuestions',
        message: 'Which questions do you want to answer?',
        choices: selectors.getQuestionsList(userData)
      }]);
      const choice = prompt.whichQuestions;
      const questions = getEntryQuestions(choice, userData);
      const answers = await _inquirer.default.prompt(questions);
      const extension = selectors.getOutputFormat(userData);
      const filePath = await (0, _ioHandlers.writeQAToOutputDir)({
        choice,
        dir: selectors.getOutputPath(userData),
        extension,
        text: (0, _ioHandlers.convertQAOutput)(choice, answers, {
          extension
        })
      });
      console.log('Successfully saved to', filePath);
      const openFile = await _inquirer.default.prompt([{
        type: 'list',
        name: 'openFile',
        message: 'Want to open your questions file?',
        choices: mapToInquirer(['Yes', 'No'])
      }]);

      if (openFile.openFile === 'Yes') {
        console.log('Opening...');
        (0, _exec.openWithVSCode)(filePath);
      } else {
        console.log('Exiting.');
      }
    }
  },
  lookAtNotes: {
    name: 'Look at notes',
    value: 'lookAtNotes',
    cb: userData => _inquirer.default.prompt([{
      type: 'list',
      name: 'whichNote',
      message: 'What note do you want to read?',
      choices: selectors.getEntriesWithPath(userData)
    }]).then(prompt => {
      const choice = prompt.whichNote;
      const noteToView = selectors.findFromData(choice, userData).path;
      console.log(`Opening ${noteToView}...`);
      (0, _exec.openConfigWithVSCode)(noteToView);
    })
  }
};
const prompt1 = [{
  type: 'list',
  name: 'topLevel',
  message: 'What do you want to do?',
  choices: [secondLevel.answerQuestions, secondLevel.lookAtNotes]
}];

var _default = config => {
  return _inquirer.default.prompt(prompt1).then(answers => {
    const choice = answers.topLevel;
    return secondLevel[choice].cb(config);
  });
};

exports.default = _default;