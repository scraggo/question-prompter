import { expect } from 'chai';
import sinon from 'sinon';
import inquirer from 'inquirer';

import { Prompter } from './prompter';
import * as fixtures from './fixtures';

describe('prompter - Prompter class', () => {
  const inquirerStub = sinon.stub(inquirer, 'prompt');

  it('initializes with a config', () => {
    // @ts-ignore
    const getInitialized = () => new Prompter(fixtures.appConfigMinimal);

    expect(getInitialized).not.to.throw();
  });

  it('initializes with a config', () => {
    inquirerStub.resolves({ topLevel: 'answerQuestions' });
    // @ts-ignore
    const prompter = new Prompter(fixtures.appConfigMinimal);
    expect(() => prompter.main()).not.to.throw();
  });
});
