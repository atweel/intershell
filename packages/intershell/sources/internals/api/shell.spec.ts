import 'jest';

import { execSync, exec, ChildProcess, ExecSyncOptions, ExecOptions } from 'child_process';
import { promisify } from 'util';

import { TAG_FUNCTION_METADATA_KEY } from './../../constants';
import { shell } from './shell';

import 'reflect-metadata';

jest.mock('child_process', () => ({
    exec: jest.fn((...args: any[]) => {
        const callback = args.length > 0 && args[args.length - 1];

        if (typeof callback === 'function') {
            setImmediate(() => callback(null, 'mock output'));
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

                const tagFunction = shell(interpreter);

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

    it('returns a valid promise, when invoked via promisify', () => {
        const interpreter = '/bin/interpreter';

        const shellTag = shell(interpreter);

        const script = promisify(shellTag`echo "message"`);

        return script().then((stdout) => {
            expect(stdout).toEqual('mock output');
            expect(exec).toHaveBeenLastCalledWith(`echo "message"`,
                                                  { shell: interpreter },
                                                  expect.anything());
        });
    });
});
