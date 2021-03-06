import {
    ExecOptions,
    ExecSyncOptions,
    ExecException,
} from 'child_process';

type ShellInvocationMode = 'sync' | 'async';

type ShellExecOptions<M extends ShellInvocationMode> = Omit<M extends 'sync' ? ExecSyncOptions : ExecOptions, 'shell'>;

type ExecAsyncCallback = (error: ExecException | null, stdout: string | Buffer, stderr: string | Buffer) => void;

type ShellArgument = number | string | boolean | undefined;

interface ShellArguments {
    [key: string]: ShellArgument;
}

type ShellArgumentSelectorExpression<A> = (a: A) => ShellArgument;
type ShellArgumentIndexerExpression<A> = (keyof A)[];
type ShellArgumentExpression<A> = ShellArgumentSelectorExpression<A> | ShellArgumentIndexerExpression<A>;

type ShellArgumentSelector<A> = (a: Partial<A>) => ShellArgument;

type ShellArgumentBinding<A> = ShellArgument | ShellArgumentExpression<A>;

type ScriptExecutionParameters<M extends ShellInvocationMode, A extends ShellArguments> = (Readonly<A> extends A ? A | undefined : A) & {
    options?: ShellExecOptions<M>;
};

export {
    ShellInvocationMode,
    ShellExecOptions,
    ExecAsyncCallback,
    ShellArgument,
    ShellArguments,
    ShellArgumentSelectorExpression,
    ShellArgumentIndexerExpression,
    ShellArgumentExpression,
    ShellArgumentBinding,
    ScriptExecutionParameters,
    ShellArgumentSelector,
};
