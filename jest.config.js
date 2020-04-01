const { pathsToModuleNameMapper } = require('ts-jest/utils');
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const path = require('path');

const tsConfigPath = path.join(process.cwd(), 'tsconfig');

const { compilerOptions } = require(tsConfigPath);

module.exports = {
    // globalSetup: './tests/hooks/setup.js',
    // globalTeardown: './tests/hooks/teardown.js',
    preset: 'ts-jest',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: path.resolve(compilerOptions.baseUrl) + path.sep,
    }),
    globals: {
        'ts-jest': {    
            tsConfig: tsConfigPath + '.json'
        }
    }
};
