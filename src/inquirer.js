import inquirer from 'inquirer';
import { openConfigWithVSCode, openWithVSCode } from './utils/exec';
import { convertQAOutput, writeQAToOutputDir } from './io-handlers';
import * as selectors from './data/selectors';

/**
 * @param {Array<string|Object>} questions if {string}, simple format
 * @returns {Array<Object>} questions mapped to inquirer format
 */
const mapToInquirer = questions =>
  questions.map(q => {
    if (typeof q === 'string') {
      return {
        name: q
      };
    }
    return q;
  });

const getEntryQuestions = (choice, userData) => {
  const { questions } = selectors.findFromData(choice, userData);
  return mapToInquirer(questions);
};

const secondLevel = {
  answerQuestions: {
    name: 'Answer questions',
    value: 'answerQuestions',
    cb: async userData => {
      const prompt = await inquirer.prompt([
        {
          type: 'list',
          name: 'whichQuestions',
          message: 'Which questions do you want to answer?',
          choices: selectors.getQuestionsList(userData)
        }
      ]);
      const choice = prompt.whichQuestions;
      const questions = getEntryQuestions(choice, userData);

      const answers = await inquirer.prompt(questions);

      const extension = selectors.getOutputFormat(userData);

      const filePath = await writeQAToOutputDir({
        choice,
        dir: selectors.getOutputPath(userData),
        extension,
        text: convertQAOutput(choice, answers, { extension })
      });
      console.log('Successfully saved to', filePath);

      const openFile = await inquirer.prompt([
        {
          type: 'list',
          name: 'openFile',
          message: 'Want to open your questions file?',
          choices: mapToInquirer(['Yes', 'No'])
        }
      ]);
      if (openFile.openFile === 'Yes') {
        console.log('Opening...');
        openWithVSCode(filePath);
      } else {
        console.log('Exiting.');
      }
    }
  },
  lookAtNotes: {
    name: 'Look at notes',
    value: 'lookAtNotes',
    cb: userData =>
      inquirer
        .prompt([
          {
            type: 'list',
            name: 'whichNote',
            message: 'What note do you want to read?',
            choices: selectors.getEntriesWithPath(userData)
          }
        ])
        .then(prompt => {
          const choice = prompt.whichNote;
          const noteToView = selectors.findFromData(choice, userData).path;
          console.log(`Opening ${noteToView}...`);
          openConfigWithVSCode(noteToView);
        })
  }
};

const prompt1 = [
  {
    type: 'list',
    name: 'topLevel',
    message: 'What do you want to do?',
    choices: [secondLevel.answerQuestions, secondLevel.lookAtNotes]
  }
];

export default config => {
  return inquirer.prompt(prompt1).then(answers => {
    const choice = answers.topLevel;
    return secondLevel[choice].cb(config);
  });
};
