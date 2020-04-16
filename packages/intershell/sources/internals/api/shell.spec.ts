import 'jest';

let execShouldFail = false;

import { execSync, exec, ChildProcess, ExecSyncOptions, ExecOptions } from 'child_process';
import { promisify } from 'util';

import { TAG_FUNCTION_METADATA_KEY } from './../../constants';
import { shell } from './shell';

import 'reflect-metadata';

jest.mock('child_process', () => ({
    exec: jest.fn((...args: any[]) => {
        const callback = args.length > 0 && args[args.length - 1];

        if (!execShouldFail) {
            if (typeof callback === 'function') {
                setImmediate(() => callback(null, 'mock output'));
            }
        } else {
            if (typeof callback === 'function') {
                setImmediate(() => callback(new Error()));
            }
        }

        return {} as ChildProcess;
    }),
    execSync: jest.fn(() => {
        return 'mock output';
    }),
}));

describe('shell function', () => {
    describe('invoked with custom interpreter', () => {
        it('produces a tag function with specific metadata', () => {
            const interpreter = '/bin/interpreter';

            const tagFunction = shell(interpreter);

            expect(typeof tagFunction === 'function');
            expect(Reflect.getMetadata(TAG_FUNCTION_METADATA_KEY, tagFunction))
                .toEqual({ interpreter });
        });

        describe('produces a tag function that passes the specified interpreter', () => {
            it('to the exec function in async mode', (done) => {
                const interpreter = '/bin/interpreter';

                const tagFunction = shell(interpreter);

                const script = tagFunction`echo "message"`;

                script.execAsync({}, (error, stdout) => {
                    try {
                        expect(error).toEqual(null),
                        expect(stdout).toEqual('mock output');
                        expect(exec).toHaveBeenLastCalledWith(`echo "message"`,
                                                              { shell: interpreter },
                                                              expect.anything());

                        done();
                    } catch(err) {
                        done(err);
                    }
                });
            });

            it('to the execSync function in sync mode', () => {
                const interpreter = '/bin/interpreter';

                const tagFunction = shell<{ a?: string }>(interpreter);

                const script = tagFunction`echo "message"`;

                const output = script.execSync();

                expect(output).toEqual('mock output');
                expect(execSync).toHaveBeenLastCalledWith(`echo "message"`,
                                                          { shell: interpreter });
            });
        });
    });

    it('passes execution options to the execSync function', () => {
        const interpreter = '/bin/interpreter';

        const shellTag = shell(interpreter);

        const script = shellTag`echo "message"`;

        const options: ExecSyncOptions = {
            cwd: '/usr/some/directory',
            input: 'input',
            stdio: 'ignore',
            killSignal: 1000,
            maxBuffer: 500,
            encoding: 'encoding',
        };

        script.execSync({ options });

        expect(execSync).toHaveBeenLastCalledWith(`echo "message"`,
                                                  {
                                                      ...options,
                                                      shell: interpreter,
                                                  });
    });

    it('passes execution options to the exec function', (done) => {
        const interpreter = '/bin/interpreter';

        const shellTag = shell(interpreter);

        const script = shellTag`echo "message"`;

        const options: ExecOptions = {
            cwd: '/usr/some/directory',
            killSignal: 1000,
            maxBuffer: 500,
        };

        script.execAsync({ options }, (error, stdout) => {
            try {
                expect(error).toEqual(null),
                expect(stdout).toEqual('mock output');
                expect(exec).toHaveBeenLastCalledWith(`echo "message"`,
                                                      {
                                                          ...options,
                                                          shell: interpreter,
                                                      },
                                                      expect.anything());

                done();
            } catch(err) {
                done(err);
            }
        });
    });

    it('passes execution options to the exec function, when invoked without callback', () => {
        const interpreter = '/bin/interpreter';

        const shellTag = shell(interpreter);

        const script = shellTag`echo "message"`;

        const options: ExecOptions = {
            cwd: '/usr/some/directory',
            killSignal: 1000,
            maxBuffer: 500,
        };

        script.execAsync({ options });

        expect(exec).toHaveBeenLastCalledWith(`echo "message"`,
                                              {
                                                  ...options,
                                                  shell: interpreter,
                                              });
    });

    it('invokes the callback when invoked without parameters', (done) => {
        const interpreter = '/bin/interpreter';

        const shellTag = shell(interpreter);

        const script = shellTag`echo "message"`;

        script.execAsync((error, stdout) => {
            try {
                expect(error).toEqual(null),
                expect(stdout).toEqual('mock output');
                expect(exec).toHaveBeenLastCalledWith(`echo "message"`,
                                                      { shell: interpreter },
                                                      expect.anything());

                done();
            } catch(err) {
                done(err);
            }
        });
    });

    it('returns a valid promise, when invoked via promisify', async () => {
        const interpreter = '/bin/interpreter';

        const shellTag = shell(interpreter);

        await expect(promisify(shellTag`echo "message"`)())
            .resolves.toEqual('mock output');

        expect(exec).toHaveBeenLastCalledWith(`echo "message"`, { shell: interpreter }, expect.anything());
    });

    it('rejects the promise if shell command fails, when invoked via promisify without parameters', async () => {
        execShouldFail = true;

        await expect(promisify(shell`echo "message"`)())
            .rejects.toThrow();
    });

    it('rejects the promise if shell command fails, when invoked via promisify with parameters', async () => {
        execShouldFail = true;

        await expect(promisify(shell<{ arg: string }>`echo "message"`)({ arg: '' }))
            .rejects.toThrow();
    });

    it('resolves the promise if shell command succeeds, when invoked via promisify with parameters', async () => {
        execShouldFail = false;

        await expect(promisify(shell<{ arg: string }>`echo "message"`)({ arg: '' }))
            .resolves.toMatch('mock output');
    });

    it(`correctly formats parameters passed using selector ('array') notation`, () => {
        const script = shell<{
            booleanTrueFlag: boolean;
            booleanFalseFlag: boolean;
            numericParameter: number;
            stringParameter: string;
        }>`command ${ [ 'booleanTrueFlag', 'booleanFalseFlag', 'numericParameter', 'stringParameter' ] }`;

        const output = script.execSync({
            booleanTrueFlag: true,
            booleanFalseFlag: false,
            numericParameter: 100,
            stringParameter: 'some string',
        }).toString();

        expect(output).toEqual('mock output');
        expect(execSync)
            .toHaveBeenLastCalledWith(`command --boolean-true-flag --numeric-parameter 100 --string-parameter "some string"`, { 'shell': '/bin/sh' });
    });

    it(`throws TypeError when invoked with an argument other than a string literal`, async () => {
        expect(() => shell([] as unknown as TemplateStringsArray))
            .toThrow(TypeError);
    });

    it(`correctly substitutes variables from external scope`, async () => {
        const value = 'value';

        shell`echo ${ value }`.execSync();

        expect(execSync)
            .toHaveBeenLastCalledWith(`echo value`, { 'shell': '/bin/sh' });
    });

    it(`correctly substitutes function arguments`, async () => {
        shell<{ argument: string }>`echo ${ ({ argument }): string => argument }`
            .execSync({ argument: 'value' });

        expect(execSync)
            .toHaveBeenLastCalledWith(`echo value`, { 'shell': '/bin/sh' });
    });
});
