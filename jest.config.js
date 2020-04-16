const path = require('path');

const tsConfigPath = path.join(process.cwd(), 'tsconfig');

module.exports = {
    projects: [
        "<rootDir>",
        "<rootDir>/packages/*"
    ],
    testMatch: [ '<rootDir>/tests/*.test.ts' ],
    modulePaths: [ '<rootDir>/packages/*' ],
    preset: 'ts-jest',
    globals: {
        'ts-jest': {    
            tsConfig: tsConfigPath + '.json'
        }
    }
};
