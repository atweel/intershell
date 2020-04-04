import {
    exec,
    execSync,
    ExecOptions,
    ExecSyncOptions,
    ExecException,
    ChildProcess,
} from 'child_process';
import 'reflect-metadata';
import debugFactory from 'debug';
import { promisify, CustomPromisifySymbol } from 'util';

const debug = debugFactory('intershell');

import { DEFAULT_INTERPRETER, SUPPORTED_INTERPRETERS, TAG_FUNCTION_METADATA_KEY } from '../../constants';

type ShellInvocationMode = 'sync' | 'async';

type ShellExecOptions<M extends ShellInvocationMode> = Omit<M extends 'sync' ? ExecSyncOptions : ExecOptions, 'shell'>;

type ExecAsyncCallback = (error: ExecException | null, stdout: string | Buffer, stderr: string | Buffer) => void;

type ShellArgument = number | string | boolean | undefined | null;

interface ShellArguments {
    [key: string]: ShellArgument;
}

type ShellArgumentSelectorExpression<A> = (a: A | undefined) => ShellArgument;
type ShellArgumentIndexerExpression<A> = [keyof A];
type ShellArgumentExpression<A> = ShellArgumentSelectorExpression<A> | ShellArgumentIndexerExpression<A>;

type ShellArgumentBinding<A> = ShellArgument | ShellArgumentExpression<A>;

type ScriptExecutionParameters<M extends ShellInvocationMode, A extends ShellArguments> = A & {
    options?: ShellExecOptions<M>;
}

type ShellCommandFunctionWithPromise<A extends ShellArguments> = (parameters?: ScriptExecutionParameters<'async', A>) => Promise<string | Buffer>;

interface ShellCommandFunction<A extends ShellArguments> extends CustomPromisifySymbol<ShellCommandFunctionWithPromise<A>> {
    (callback?: ExecAsyncCallback): ChildProcess;
    (parameters?: ScriptExecutionParameters<'async', A>, callback?: ExecAsyncCallback): ChildProcess;
    execSync(parameters?: ScriptExecutionParameters<'sync', A>): Buffer;
    execAsync(callback?: ExecAsyncCallback): ChildProcess;
    execAsync(parameters?: ScriptExecutionParameters<'async', A>, callback?: ExecAsyncCallback): ChildProcess;
}

interface ShellTagFunction<A extends ShellArguments> {
    (strings: TemplateStringsArray, ...parameters: any[]): ShellCommandFunction<A>;
}

function assertTypeTemplateStringsArray(obj: any): asserts obj is TemplateStringsArray {
    if (!obj.raw || !Array.isArray(obj)) {
        throw new TypeError(`${ obj } is not a TemplateStringsArray.`);
    }
}

function shell<A extends ShellArguments = {}>(interpreter: string): ShellTagFunction<A>;
function shell<A extends ShellArguments = {}>(interpreter: string, mode: ShellInvocationMode): ShellTagFunction<A>;
function shell<A extends ShellArguments = {}>(strings: TemplateStringsArray, ...bindings: ShellArgumentBinding<A>[]): ShellCommandFunction<A>;
function shell<A extends ShellArguments = {}>(arg1: string | TemplateStringsArray, ...bindings: ShellArgumentBinding<A>[]): ShellTagFunction<A> | ShellCommandFunction<A> {
    if (typeof arg1 === 'string') {
        const interpreter: string = arg1;

        const tagFunction = (scriptParts: TemplateStringsArray, ...bindings: ShellArgumentBinding<A>[]): ShellCommandFunction<A> => {
            assertTypeTemplateStringsArray(scriptParts);

            const expressions: ShellArgumentSelectorExpression<A>[] = bindings
                .map((binding) => typeof binding === 'function'
                    ? binding
                    : Array.isArray(binding)
                        ? (args: A | undefined): ShellArgument => args?.[binding[0]]
                        : (): ShellArgument => binding);

            const compileScript = (parameters?: ScriptExecutionParameters<'sync', A>): string => {
                const resolveArgument = (index: number): string => {
                    let value = '' + (expressions[index]?.(parameters) || '');

                    if (value.includes('"')) {
                        value = value.replace(/"/g, '\\"');
                    }

                    return value.includes(' ') ? `"${ value }"` : value;
                };

                return scriptParts
                    .map((str, index) => str + resolveArgument(index))
                    .join('')
                    .trim();
            };

            function syncCommandFunction(parameters?: ScriptExecutionParameters<'sync', A>): Buffer {
                return execSync(compileScript(parameters), { ...parameters?.options, shell: interpreter });
            }

            function asyncCommandFunction(callback?: ExecAsyncCallback): ChildProcess;
            function asyncCommandFunction(parameters?: ScriptExecutionParameters<'async', A>,
                                          callback?: ExecAsyncCallback): ChildProcess;
            function asyncCommandFunction(...args: any[]): ChildProcess {
                if (args.length === 2) {
                    const script = compileScript(args[0]);

                    debug(`Executing script '${ script.split('\n')[0] }...'" in asyncronous mode with a callback...`);

                    return exec(script, { ...args[0]?.options, shell: interpreter }, args[1]);
                } else {
                    if (typeof args[0] === 'object') {
                        const script = compileScript(args[0]);

                        debug(`Executing script '${ script.split('\n')[0] }...'" in asyncronous mode without a callback...`);

                        return exec(script, { shell: interpreter });
                    } else {
                        const script = compileScript();

                        debug(`Executing script '${ script.split('\n')[0] }...'" in asyncronous mode with a callback...`);

                        return exec(script, { shell: interpreter }, args[0]);
                    }

                }
            }

            function asyncCommandFunctionWithPromise(parameters?: ScriptExecutionParameters<'async', A>): Promise<string | Buffer> {
                return new Promise((resolve, reject) => {
                    asyncCommandFunction(parameters, (error, stdout) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(stdout);
                        }
                    });
                });
            }

            return Object.assign(asyncCommandFunction, {
                execSync: syncCommandFunction,
                execAsync: asyncCommandFunction,
                [promisify.custom]: asyncCommandFunctionWithPromise,
            });
        };

        Reflect.defineMetadata(TAG_FUNCTION_METADATA_KEY, { interpreter }, tagFunction);

        return tagFunction;
    } else {
        return shell(DEFAULT_INTERPRETER)(arg1, ...bindings);
    }
}

export {
    shell,
    ShellTagFunction,
    SUPPORTED_INTERPRETERS,
};
