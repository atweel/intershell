import { exec, execSync, ExecOptions,ExecSyncOptions, ExecException, ChildProcess } from 'child_process';
import 'reflect-metadata';

import { DEFAULT_INTERPRETER, SUPPORTED_INTERPRETERS, TAG_FUNCTION_METADATA_KEY } from './../../constants';

type ShellInvocationMode = 'sync' | 'async';

type ShellExecOptions<M extends ShellInvocationMode> = Omit<M extends 'sync' ? ExecSyncOptions : ExecOptions, 'shell'>;

type ExecAsyncCallback = (error: ExecException | null, stdout: string | Buffer, stderr: string | Buffer) => void;

interface ShellCommandFunction {
    (options?: ShellExecOptions<'async'>, callback?: ExecAsyncCallback): ChildProcess;
    execSync(options?: ShellExecOptions<'sync'>): Buffer;
    execAsync(options?: ShellExecOptions<'async'>, callback?: ExecAsyncCallback): ChildProcess;
}

interface ShellTagFunction {
    (strings: TemplateStringsArray, ...parameters: any[]): ShellCommandFunction;
}

function assertTypeTemplateStringsArray(obj: any): asserts obj is TemplateStringsArray {
    if (!obj.raw || !Array.isArray(obj)) {
        throw new TypeError(`${ obj } is not a TemplateStringsArray.`);
    }
}

function shell(interpreter: string): ShellTagFunction;
function shell(interpreter: string, mode: ShellInvocationMode): ShellTagFunction;
function shell(strings: TemplateStringsArray, ...parameters: any[]): ShellCommandFunction;
function shell(arg1: string | TemplateStringsArray, ...parameters: any[]): ShellTagFunction | ShellCommandFunction {
    if (typeof arg1 === 'string') {
        const tagFunction = (strings: TemplateStringsArray, ...parameters: any[]): ShellCommandFunction => {
            assertTypeTemplateStringsArray(strings);

            const script = strings
                .map((str, index) => str + (parameters[index] || '' ))
                .join('');

            const syncCommandFunction = (options?: ExecSyncOptions): Buffer => {
                return execSync(script, options);
            };

            const asyncCommandFunction = (options?: ExecOptions, callback?: ExecAsyncCallback): ChildProcess => {
                return exec(script, { ...options, shell: arg1 }, callback);
            };

            return Object.assign(asyncCommandFunction, {
                execSync: syncCommandFunction,
                execAsync: asyncCommandFunction,
            });
        };

        Reflect.defineMetadata(TAG_FUNCTION_METADATA_KEY, { interpreter: arg1 }, tagFunction);

        return tagFunction;
    } else {
        return shell(DEFAULT_INTERPRETER)(arg1, ...parameters);
    }
}

export {
    shell,
    ShellTagFunction,
    SUPPORTED_INTERPRETERS,
};
