const { pathsToModuleNameMapper } = require('ts-jest/utils');
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const path = require('path');

const tsConfigPath = path.join(__dirname, 'tsconfig');

const { compilerOptions } = require(tsConfigPath);

module.exports = {
    preset: 'ts-jest',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: path.resolve(__dirname, compilerOptions.baseUrl) + path.sep,
    }),
    coverageThreshold: {
        global: {
          branches: 85,
          functions: 85,
          lines: 85,
          statements: 85
        }
    },
    coverageReporters: ['text', 'lcov'],
    globals: {
        'ts-jest': {    
            tsConfig: tsConfigPath + '.json'
        }
    }
};
