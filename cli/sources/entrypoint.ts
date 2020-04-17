/* eslint-disable no-control-regex */
import 'ts-polyfill/lib/es2020-string';
import { execSync } from 'child_process';

const output = execSync('aws cloudformation deploy help').toString().replace(/[\x00-\x1F\x7F-\x9F]./g, '');

Array.from(output.matchAll(/--(?<key>[\w-]+)\s*\((?<type>\w+)\)/gi))
    .map(({ groups }) => ({
        key: groups?.['key'],
        type: groups?.['type'],
    }))
    .forEach(({ key, type }) => console.log(`${ key }: ${ type }`));
