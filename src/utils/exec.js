import { execSync } from 'child_process';
import { existsAsync, resolvePath } from './fs';

const openWith = (filePath, cmd) => {
  const resolvedPath = resolvePath(filePath);
  return existsAsync(resolvedPath).then(() =>
    execSync(`${cmd} ${resolvedPath}`)
  );
};

const openWithVSCodeBare = filePath => openWith(filePath, 'code');

// todo: allow to open with 'default' or user specified other
export const openWithVSCode = filePath => {
  return openWithVSCodeBare(filePath).catch(err => {
    console.error(err);
  });
};

export const openConfigWithVSCode = filePath =>
  openWithVSCodeBare(filePath).catch(err => {
    console.error('The "path" specified in config file wasn\'t found.');
    console.error(err.message);
  });
