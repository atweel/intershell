const path = require('path');

const tsConfigPath = path.join(process.cwd(), 'tsconfig');

module.exports = {
    projects: [
        "<rootDir>",
        "<rootDir>/package",
        "<rootDir>/cli"
    ],
    testMatch: [ '<rootDir>/tests/*.test.ts' ],
    modulePaths: [ '<rootDir>/package' ],
    preset: 'ts-jest',
    globals: {
        'ts-jest': {    
            tsConfig: tsConfigPath + '.json'
        }
    }
};
