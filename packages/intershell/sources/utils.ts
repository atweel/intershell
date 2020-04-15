import { paramCase } from 'param-case';

import { ShellArgument, ShellArguments } from 'primitives';

const escape = (value: string): string => value.replace(/(?<!\\)"/g, `\\"`);

const escapeAndQuote = (value: string): string => value
    .match(/(\s)|(^(?![\s\S]))/)
    ? `"${ escape(value) }"`
    : escape(value);


const formatShellArgument = (key: string, value: Exclude<ShellArgument, undefined>): string => {
    switch (typeof value) {
        case 'boolean':
            return value ? `--${ paramCase(key) }` : '';

        case 'string':
            return `--${ paramCase(key) } ${ escapeAndQuote(value) }`;

        case 'number':
            return `--${ paramCase(key) } ${ value.toString() }`;
    }
};

const projectShellArguments = <A extends ShellArguments>(args: Partial<A>, filter: (keyof A)[]): string => {
    return Object.entries(args)
        .map(([ key, value ]) => ({ key, value }))
        .filter(({ key, value }) => filter.includes(key) && typeof value !== 'undefined')
        .map(({ key, value }) => formatShellArgument(key, value))
        .filter((value) => !!value)
        .join(' ');
};

export {
    escape,
    escapeAndQuote,
    formatShellArgument,
    projectShellArguments,
};
