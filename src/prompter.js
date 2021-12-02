import inquirer from 'inquirer';
import { openConfigWithVSCode, openWithVSCode } from './utils/exec';
import { convertQAOutput, writeQAToOutputDir } from './io-handlers';
import * as selectors from './selectors';

/**
 * @typedef {import('./types').AppConfig} AppConfig
 * @typedef {inquirer.QuestionCollection} QuestionCollection
 */

// choice constants
const ANSWER_QUESTIONS = 'answerQuestions';
const VIEW_NOTES = 'lookAtNotes';
const OPEN_FILE = 'openFile';
const TOP_LEVEL = 'topLevel';
const WHICH_NOTE = 'whichNote';
const WHICH_QUESTIONS = 'whichQuestions';

const asyncPrompt = inquirer.prompt;

/**
 * @param {string} key key
 * @param {QuestionCollection} questions questions
 * @returns {Promise<any>} choice
 */
const getInquirerChoice = async (key, questions) => {
  const answers = await asyncPrompt(questions);
  return answers[key];
};

/**
 * @param {Array<string|Object>} questions if {string}, simple format
 * @returns {QuestionCollection} questions mapped to inquirer format
 */
const mapToInquirer = questions => {
  return questions.map(q =>
    typeof q === 'string'
      ? {
          name: q
        }
      : q
  );
};

/**
 * @param {string} choice choice string
 * @param {AppConfig} config AppConfig
 * @returns {QuestionCollection} entry questions
 */
const getEntryQuestions = (choice, config) => {
  const result = selectors.findFromData(choice, config);
  if (result && 'questions' in result) {
    // @ts-ignore
    return mapToInquirer(result.questions);
  }

  throw new Error(`Unexpected result for getEntryQuestions: ${result}`);
};

export class Prompter {
  /**
   * @param {AppConfig} config AppConfig
   */
  constructor(config) {
    this.config = config;

    this.prompts = {
      [ANSWER_QUESTIONS]: {
        name: 'Answer questions',
        value: ANSWER_QUESTIONS,
        cb: this.answerQuestionsCallback.bind(this)
      },
      [VIEW_NOTES]: {
        name: 'Look at notes',
        value: VIEW_NOTES,
        cb: this.lookAtNotesCallback.bind(this)
      },
      [WHICH_NOTE]: [
        {
          type: 'list',
          name: WHICH_NOTE,
          message: 'What note do you want to read?',
          choices: selectors.getEntriesWithPath(this.config)
        }
      ],
      [WHICH_QUESTIONS]: [
        {
          type: 'list',
          name: WHICH_QUESTIONS,
          message: 'Which questions do you want to answer?',
          choices: selectors.getQuestionsList(this.config)
        }
      ],
      [OPEN_FILE]: [
        {
          type: 'list',
          name: OPEN_FILE,
          message: 'Want to open your questions file?',
          choices: mapToInquirer(['Yes', 'No'])
        }
      ]
    };
  }

  async main() {
    const topLevelPrompt = [
      {
        type: 'list',
        name: TOP_LEVEL,
        message: 'What do you want to do?',
        choices: [this.prompts[ANSWER_QUESTIONS], this.prompts[VIEW_NOTES]]
      }
    ];
    const choice = await getInquirerChoice(TOP_LEVEL, topLevelPrompt);
    // @ts-ignore
    return this.prompts[choice].cb();
  }

  async answerQuestionsCallback() {
    const choice = await getInquirerChoice(
      WHICH_QUESTIONS,
      this.prompts[WHICH_QUESTIONS]
    );

    const questions = getEntryQuestions(choice, this.config);

    if (!questions) {
      throw new Error(`No questions found for choice: ${choice}`);
    }

    const answers = await asyncPrompt(questions);

    const extension = selectors.getOutputFormat(this.config);

    const filePath = await writeQAToOutputDir({
      choice,
      dir: selectors.getOutputPath(this.config),
      extension,
      text: convertQAOutput(choice, answers, { extension })
    });
    console.log('Successfully saved to', filePath);

    const openFile = await asyncPrompt(this.prompts[OPEN_FILE]);

    if (openFile[OPEN_FILE] === 'Yes') {
      console.log('Opening...');
      openWithVSCode(filePath);
    } else {
      console.log('Exiting.');
    }
  }

  async lookAtNotesCallback() {
    // /** @type {string} */
    const choice = await getInquirerChoice(
      WHICH_NOTE,
      this.prompts[WHICH_NOTE]
    );

    const noteToView = selectors.findFromData(choice, this.config);

    if (!noteToView || !('path' in noteToView)) {
      throw new Error(`Note path not found: ${choice}`);
    }

    const notePath = noteToView.path;
    console.log(`Opening ${notePath}...`);
    await openConfigWithVSCode(notePath);
  }
}
