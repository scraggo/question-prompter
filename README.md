# node-question-prompter

prompt for user configured questions and notes. [Read more](https://scraggo.com/using-question-prompter/).

## Usage

`npm run build` to transpile the script.

### From package root

`npm start -- -c <path to config.json>`

> see `src/commander.js` for command line options

### From anywhere

`node PATH/TO/SCRIPT/build/index.js -c <path to config.json>`

### Developing

`npm run start-dev` run once

`npm run start-dev-ex` same as above, using config in `/example`

`npm run start-watch` watch mode

## Configuration File

Choose between `json` and `yaml` formats.

```yaml
config:
  output: directory path

content:
  - name: any name for this experience
    path: path/to/experience # any file type
    # Simple format, array of question strings
    questions:
      - question1
      - question2

  - name: experience2
    path: path/to/experience2.txt
    # Inquirer's format - objects. Any inquirer keys and values are valid.
    questions:
      - name: question1
      - name: question2
```

## Credit

Started with [node-cli-scaffold](https://github.com/williscool/node-cli-scaffold)
