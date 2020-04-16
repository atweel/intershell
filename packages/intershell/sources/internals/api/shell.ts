/* eslint-disable @typescript-eslint/no-unused-vars */
import {
    exec,
    execSync,
    ChildProcess,
} from 'child_process';
import 'reflect-metadata';
import debugFactory from 'debug';
import { promisify, CustomPromisifySymbol } from 'util';

const debug = debugFactory('intershell');

import {
    DEFAULT_INTERPRETER,
    SUPPORTED_INTERPRETERS,
    TAG_FUNCTION_METADATA_KEY,
} from '../../constants';

import {
    ShellInvocationMode,
    ExecAsyncCallback,
    ShellArgument,
    ShellArguments,
    ShellArgumentSelectorExpression,
    ShellArgumentBinding,
    ScriptExecutionParameters,
    ShellArgumentSelector,
} from '../../primitives';

import { projectShellArguments } from '../../utils';

type PromisifySymbol<A extends ShellArguments> = Partial<A> extends A
    ? CustomPromisifySymbol<{
        (): Promise<string | Buffer>;
        (parameters: ScriptExecutionParameters<'async', A>): Promise<string | Buffer>;
    }> : CustomPromisifySymbol<{
        (parameters: ScriptExecutionParameters<'async', A>): Promise<string | Buffer>;
    }>

type AsynchronousShellCommandFunction<A extends ShellArguments> = Partial<A> extends A
    ? {
        (callback?: ExecAsyncCallback): ChildProcess;
        (parameters: ScriptExecutionParameters<'async', A>, callback?: ExecAsyncCallback): ChildProcess;
    } & PromisifySymbol<A>
    : {
        (parameters: ScriptExecutionParameters<'async', A>, callback?: ExecAsyncCallback): ChildProcess;
    } & PromisifySymbol<A>

type SynchronousShellCommandFunction<A extends ShellArguments> = Partial<A> extends A
    ? {
        (): Buffer;
        (parameters: ScriptExecutionParameters<'sync', A>): Buffer;
    } : {
        (parameters: ScriptExecutionParameters<'sync', A>): Buffer;
    }

type ShellCommandFunction<A extends ShellArguments> = AsynchronousShellCommandFunction<A> & {
    execSync: SynchronousShellCommandFunction<A>;
    execAsync: AsynchronousShellCommandFunction<A>;
    compile: (parameters?: A) => string;
}

// interface ShellCommandFunction<A extends ShellArguments> extends CustomPromisifySymbol<ShellCommandFunctionWithPromise<A>> {
//     (callback?: ExecAsyncCallback): Optional<A> extends A ? ChildProcess : never;
//     (parameters: ScriptExecutionParameters<'async', A>, callback?: ExecAsyncCallback): ChildProcess;
//     execSync(): Optional<A> extends A ? Buffer : never;
//     execSync(parameters: ScriptExecutionParameters<'sync', A>): Buffer;
//     execAsync(callback?: ExecAsyncCallback): Optional<A> extends A ? ChildProcess : never;
//     execAsync(parameters: ScriptExecutionParameters<'async', A>, callback?: ExecAsyncCallback): ChildProcess;
// }

interface ShellTagFunction<A extends ShellArguments> {
    (strings: TemplateStringsArray, ...parameters: any[]): ShellCommandFunction<A>;
}

function assertTypeTemplateStringsArray(obj: any): asserts obj is TemplateStringsArray {
    if (!obj.raw || !Array.isArray(obj)) {
        throw new TypeError(`${ obj } is not a TemplateStringsArray.`);
    }
}

const traceScript = (script: string): string => script.trim().split('\n')[0];

function shell<A extends ShellArguments = {}>(interpreter: string): ShellTagFunction<A>;
function shell<A extends ShellArguments = {}>(interpreter: string, mode: ShellInvocationMode): ShellTagFunction<A>;
function shell<A extends ShellArguments = {}>(strings: TemplateStringsArray, ...bindings: ShellArgumentBinding<A>[]): ShellCommandFunction<A>;
function shell<A extends ShellArguments = {}>(arg1: string | TemplateStringsArray, ...bindings: ShellArgumentBinding<A>[]): ShellTagFunction<A> | ShellCommandFunction<A> {
    if (typeof arg1 === 'string') {
        const interpreter: string = arg1;

        const tagFunction = (scriptParts: TemplateStringsArray, ...bindings: ShellArgumentBinding<A>[]): ShellCommandFunction<A> => {
            assertTypeTemplateStringsArray(scriptParts);

            if (bindings && bindings.length > 0) {
                debug(`The script contains ${ bindings.length } binding(s):\n\t${ bindings.map((binding) => binding?.toString()).join(`,\n\t`) }`);
            } else {
                debug(`The script contains no bindings.`);
            }

            const expressions: ShellArgumentSelector<A>[] = bindings
                .map((binding) => typeof binding === 'function'
                    ? (a: Partial<A>): ShellArgument => binding(a as A)
                    : Array.isArray(binding)
                        ? (args: Partial<A> = {}): ShellArgument => projectShellArguments(args, binding)
                        : ((): ShellArgument => binding));

            const compileScript = (parameters?: A): string => scriptParts
                .map((str, index) => str + (expressions[index]?.(parameters || {}) || ''))
                .join('')
                .trim();

            function syncCommandFunction(): Buffer;
            function syncCommandFunction(parameters: ScriptExecutionParameters<'sync', A>): Buffer;
            function syncCommandFunction(parameters?: ScriptExecutionParameters<'sync', A>): Buffer {
                return execSync(compileScript(parameters), { ...parameters?.options, shell: interpreter });
            }

            function asyncCommandFunction(callback?: ExecAsyncCallback): ChildProcess;
            function asyncCommandFunction(parameters: ScriptExecutionParameters<'async', A>, callback?: ExecAsyncCallback): ChildProcess;
            function asyncCommandFunction(...args: any[]): ChildProcess {
                if (args.length === 2) {
                    const script = compileScript(args[0]);

                    debug(`Executing script '${ traceScript(script) }...'" in asyncronous mode with a callback...`);

                    return exec(script, { ...args[0].options, shell: interpreter }, args[1]);
                } else {
                    if (typeof args[0] === 'object') {
                        const script = compileScript(args[0]);

                        debug(`Executing script '${ traceScript(script) }...'" in asyncronous mode without a callback...`);

                        return exec(script, { ...args[0].options, shell: interpreter });
                    } else {
                        const script = compileScript();

                        debug(`Executing script '${ traceScript(script) }...'" in asyncronous mode with a callback...`);

                        return exec(script, { shell: interpreter }, args[0]);
                    }
                }
            }

            function asyncCommandFunctionWithPromise(): Promise<string | Buffer>;
            function asyncCommandFunctionWithPromise(parameters: ScriptExecutionParameters<'async', A>): Promise<string | Buffer>;
            function asyncCommandFunctionWithPromise(parameters?: ScriptExecutionParameters<'async', A>): Promise<string | Buffer> {
                return new Promise((resolve, reject) => {
                    if (parameters) {
                        asyncCommandFunction(parameters, (error, stdout) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(stdout);
                            }
                        });
                    } else {
                        asyncCommandFunction((error, stdout) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(stdout);
                            }
                        });
                    }
                });
            }

            return Object.assign(asyncCommandFunction as AsynchronousShellCommandFunction<A>, {
                execSync: syncCommandFunction as SynchronousShellCommandFunction<A>,
                execAsync: asyncCommandFunction as AsynchronousShellCommandFunction<A>,
                compile: compileScript,
                [promisify.custom]: asyncCommandFunctionWithPromise,
            });
        };

        Reflect.defineMetadata(TAG_FUNCTION_METADATA_KEY, { interpreter }, tagFunction);

        return tagFunction;
    } else {
        return shell<A>(DEFAULT_INTERPRETER)(arg1, ...bindings);
    }
}

export {
    shell,
    ShellTagFunction,
    SUPPORTED_INTERPRETERS,
};
