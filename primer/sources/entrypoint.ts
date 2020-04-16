import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import line from './utils/line';
import tabbed from './utils/tabbed';

const examplesDirectory = path.join(__dirname, 'examples');

const exampleFiles = fs.readdirSync(examplesDirectory)
    .map((filePath) => path.resolve(examplesDirectory, filePath));

const log = console.log;

console.log = (message: string): void => {
    log(tabbed(message));
};

const renderOnScreen = (exampleFilePath: string): void => {
    log(line());

    log('Source code:');

    log(line());

    log(tabbed(fs.readFileSync(exampleFilePath).toString()));

    log(line());

    log('Output:');

    log(line());

    require(exampleFilePath);

    log(line());
};

const renderSourceCode = (exampleFilePath: string): string => {
    return [
        '// Source code:',
        fs.readFileSync(exampleFilePath).toString(),
    ].join('\n');
};

const renderOutput = (exampleFilePath: string): string => {
    return [
        '// Output:',
        ...execSync(`ts-node ${ exampleFilePath }`)
            .toString()
            .trim()
            .split('\n')
            .map((line) => '// ' + line),
    ].join('\n');
};

const renderExampleAsMarkdown = (filePath: string): string => {
    return [
        '```typescript',
        renderSourceCode(filePath),
        renderOutput(filePath),
        '```',
    ].join('\n');
};

const warning = `<!---
    The code sample below was generated automatically by the primer utility; do not edit.
    Last update on ${ new Date().toUTCString() }.
--->`;

const readmeFilePath = path.resolve(__dirname, '../../readme.md');

const readme = exampleFiles.reduce((text, filePath) => {
    const exampleName = path.basename(filePath, '.ts');

    const exampleOpeningTag = `<!---example:${ exampleName }:begin--->`;
    const exampleClosingTag = `<!---example:${ exampleName }:end--->`;

    const exampleMarkdownWithTags = [
        exampleOpeningTag,
        warning,
        renderExampleAsMarkdown(filePath),
        exampleClosingTag,
    ].join('\n');

    return text.replace(new RegExp(`${ exampleOpeningTag }(.*\n)*${ exampleClosingTag }`), exampleMarkdownWithTags);
}, fs.readFileSync(readmeFilePath).toString());

fs.writeFileSync(readmeFilePath, readme);
