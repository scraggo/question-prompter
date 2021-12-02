export interface ContentOptionBase {
  name: string;
}

export interface Note extends ContentOptionBase {
  path: string;
}

export interface Questions extends ContentOptionBase {
  questions:
    | string
    | {
        name: string;
      }[];
}

export type ContentOption = Note | Questions | Note & Questions;

type OutputFormat = 'json' | 'yaml' | 'txt';

export interface UserConfig {
  config: {
    output: string;
  };
  content: ContentOption[];
}

export type CLIArgs = {
  config: string;
  outputFormat: OutputFormat;
};

// combined CLIArgs and UserConfig
export interface AppConfig extends UserConfig {
  outputFormat: OutputFormat;
}
