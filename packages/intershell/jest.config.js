const { pathsToModuleNameMapper } = require('ts-jest/utils');
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const path = require('path');

const tsConfigPath = path.join(process.cwd(), 'tsconfig');

const { compilerOptions } = require(tsConfigPath);

module.exports = {
    // globalSetup: './tests/hooks/setup.js',
    // globalTeardown: './tests/hooks/teardown.js',
    // projects: [
    //     // {
    //     //   displayName: "Integration tests",
    //     //   //runner: "jest-runner-tsc",
    //     //   testMatch: ["<rootDir>/tests/*.test.ts"]
    //     // },
    //     // {
    //     //   displayName: "Unit tests for @atweel/intershell package",
    //     //   //runner: "jest-runner-tsc",
    //     //   testMatch: ["<rootDir>/packages/intershell/**/*.spec.ts"]
    //     // }
    //     "<rootDir>/tests/*",
    //     //"<rootDir>/packages/intershell"
    // ],
    preset: 'ts-jest',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: path.resolve(compilerOptions.baseUrl) + path.sep,
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
