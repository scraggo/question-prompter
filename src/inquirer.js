import inquirer from 'inquirer';
import { openConfigWithVSCode, openWithVSCode } from './utils/exec';
import { convertQAOutput, writeQAToOutputDir } from './io-handlers';
import * as selectors from './data/selectors';

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
      whichNote: [
        {
          type: 'list',
          name: 'whichNote',
          message: 'What note do you want to read?',
          choices: selectors.getEntriesWithPath(this.config)
        }
      ],
      whichQuestions: [
        {
          type: 'list',
          name: 'whichQuestions',
          message: 'Which questions do you want to answer?',
          choices: selectors.getQuestionsList(this.config)
        }
      ],
      openFile: [
        {
          type: 'list',
          name: 'openFile',
          message: 'Want to open your questions file?',
          choices: InquirerWrapper.mapToInquirer(['Yes', 'No'])
        }
      ]
    };
    this.prompts.topLevel = [
      {
        type: 'list',
        name: 'topLevel',
        message: 'What do you want to do?',
        choices: [this.prompts.answerQuestions, this.prompts.lookAtNotes]
      }
    ];
  }

  /**
   * @param {Array<string|Object>} questions if {string}, simple format
   * @returns {Array<Object>} questions mapped to inquirer format
   */
  static mapToInquirer(questions) {
    return questions.map(q =>
      typeof q === 'string'
        ? {
            name: q
          }
        : q
    );
  }

  async main() {
    const answers = await inquirer.prompt(this.prompts.topLevel);
    const choice = answers.topLevel;
    return this.prompts[choice].cb();
  }

  getEntryQuestions(choice) {
    const { questions } = selectors.findFromData(choice, this.config);
    return InquirerWrapper.mapToInquirer(questions);
  }

  async answerQuestionsCallback() {
    const prompt = await inquirer.prompt(this.prompts.whichQuestions);

    const choice = prompt.whichQuestions;
    const questions = this.getEntryQuestions(choice);

    const answers = await inquirer.prompt(questions);

    const extension = selectors.getOutputFormat(this.config);

    const filePath = await writeQAToOutputDir({
      choice,
      dir: selectors.getOutputPath(this.config),
      extension,
      text: convertQAOutput(choice, answers, { extension })
    });
    console.log('Successfully saved to', filePath);

    const openFile = await inquirer.prompt(this.prompts.openFile);

    if (openFile.openFile === 'Yes') {
      console.log('Opening...');
      openWithVSCode(filePath);
    } else {
      console.log('Exiting.');
    }
  }

  async lookAtNotesCallback() {
    const prompt = await inquirer.prompt(this.prompts.whichNote);

    const choice = prompt.whichNote;
    const noteToView = selectors.findFromData(choice, this.config).path;
    console.log(`Opening ${noteToView}...`);
    openConfigWithVSCode(noteToView);
  }
}

export default config => new InquirerWrapper(config).main();
