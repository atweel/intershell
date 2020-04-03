import 'jest';

import { shell, SUPPORTED_INTERPRETERS } from 'intershell';

describe(`'${ shell.name }' template literal tag...`, function () {
    describe('...when applied without parameters...', function () {
        it('...executes a trivial multiline script', function () {
            const script = shell`
                echo "message 1"
                echo "message 2"
            `;
    
            return new Promise((resolve, reject) => {
                script({}, (error, stdout) => {
                    if (error) {
                        reject(error);
                    }

                    const output = stdout.toString();
    
                    expect(output).toContain('message 1');
                    expect(output).toContain('message 2');
    
                    resolve();
                });    
            });
        });

        it('...executes a script with template parameter', function () {
            const message = 'message';

            const script = shell`
                echo ${ message }
            `;
    
            return new Promise((resolve, reject) => {
                script({}, (error, stdout) => {
                    if (error) {
                        reject(error);
                    }
    
                    expect(stdout.toString()).toContain(message);
    
                    resolve();
                });    
            });
        });

        it('...executes a script with environment variable', function () {
            const script = shell`
                echo $MESSAGE
            `;
    
            return new Promise((resolve, reject) => {
                script({
                    options: {
                        env: {
                            MESSAGE: 'message',
                        },
                    },
                }, (error, stdout) => {
                    if (error) {
                        reject(error);
                    }
    
                    expect(stdout.toString()).toContain('message');
    
                    resolve();
                });    
            });
        });

        it('...executes a script in synchronous mode', function () {
            const script = shell`
                echo $MESSAGE
            `;

            const output = script.execSync({
                options: {
                    env: {
                        MESSAGE: 'message',
                    },
                },
            });

            expect(output.toString()).toContain('message');
        });

        it('...executes a script in asynchronous mode', function () {
            const script = shell`
                echo $MESSAGE
            `;

            return new Promise((resolve, reject) => {
                script.execAsync({
                    options: {
                        env: {
                            MESSAGE: 'message',
                        },
                    },
                }, (error, stdout) => {
                    if (error) {
                        reject(error);
                    }
    
                    expect(stdout.toString()).toContain('message');
    
                    resolve();
                });    
            });
        });

        it('...executes a script with expression-bound arguments in asynchronous mode', function () {
            const script = shell<{
                numeric: number;
                word: string;
                sentence: string;
                quoted: string;
            }>`
                echo ${ a => a.numeric }
                echo ${ a => a.word }
                echo ${ a => a.sentence }
                echo ${ a => a.quoted }
            `;

            const argumentValues = {
                numeric: 1000,
                word: 'single-word',
                sentence: 'multiple words',
                quoted: 'multiple "quoted" words',
            };

            return new Promise((resolve, reject) => {
                script.execAsync({
                    ...argumentValues,
                    options: {
                        env: {
                            MESSAGE: 'message',
                        },
                    },
                }, (error, stdout) => {
                    if (error) {
                        reject(error);
                    }

                    const output = stdout.toString();
    
                    expect(output).toContain(argumentValues.numeric.toString());
                    expect(output).toContain(argumentValues.word);
                    expect(output).toContain(argumentValues.sentence);
                    expect(output).toContain(argumentValues.quoted);
    
                    resolve();
                });    
            });
        });

        it('...executes a script with indexer-bound arguments in asynchronous mode', function () {
            const script = shell<{
                numeric: number;
                word: string;
                sentence: string;
                quoted: string;
            }>`
                echo ${ [ 'numeric' ] }
                echo ${ [ 'word' ] }
                echo ${ [ 'sentence' ] }
                echo ${ [ 'quoted' ] }
            `;

            const argumentValues = {
                numeric: 1000,
                word: 'single-word',
                sentence: 'multiple words',
                quoted: 'multiple "quoted" words',
            };

            return new Promise((resolve, reject) => {
                script.execAsync({
                    ...argumentValues,
                    options: {
                        env: {
                            MESSAGE: 'message',
                        },
                    },
                }, (error, stdout) => {
                    if (error) {
                        reject(error);
                    }

                    const output = stdout.toString();
    
                    expect(output).toContain(argumentValues.numeric.toString());
                    expect(output).toContain(argumentValues.word);
                    expect(output).toContain(argumentValues.sentence);
                    expect(output).toContain(argumentValues.quoted);
    
                    resolve();
                });    
            });
        });
    });

    describe(`...when set up with a supported interpreter...`, function () {
        for (const interpreter of SUPPORTED_INTERPRETERS) {
            it(`...executes a script via ${ interpreter }`, function () {
                const script = shell(interpreter)`echo SHELL = $0`;
        
                return new Promise((resolve, reject) => {
                    script({}, (error, stdout) => {
                        if (error) {
                            reject(error);
                        }
        
                        expect(stdout.toString()).toMatch(new RegExp(`SHELL = ${ interpreter }`));
        
                        resolve();
                    });
                });
            });
        }
    });
});
