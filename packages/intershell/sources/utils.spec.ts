import 'jest';

import { formatShellArgument } from './utils';

describe('utils', () => {
    describe('formatShellArgument', () => {
        for (const value of [ true, false ]) {
            it(`correctly formats a ${ value } boolean argument`, () => {
                const key = 'key';

                const formatted = formatShellArgument(key, value);

                expect(formatted).toMatch(value ? '--key' : '');
            });
        }

        it(`correctly formats an empty string argument`, () => {
            const key = 'key';

            const formatted = formatShellArgument(key, '');

            expect(formatted).toMatch(`--key ""`);
        });

        it(`correctly formats a non-empty string argument without whitespaces`, () => {
            const key = 'key';

            const formatted = formatShellArgument(key, 'somestring');

            expect(formatted).toMatch(`--key somestring`);
        });

        it(`correctly formats a non-empty string argument containing whitespaces`, () => {
            const key = 'key';

            const formatted = formatShellArgument(key, 'some string');

            expect(formatted).toMatch(`--key "some string"`);
        });

        it(`correctly escapes quotes in a string argument`, () => {
            const key = 'key';

            const formatted = formatShellArgument(key, `string "with" quotes`);

            expect(formatted).toMatch(`--key "string \\"with\\" quotes"`);
        });

        it(`correctly formats an integer numeric argument`, () => {
            const key = 'key';

            const formatted = formatShellArgument(key, 1000);

            expect(formatted).toMatch(`--key 1000`);
        });

        it(`correctly formats a real numeric argument`, () => {
            const key = 'key';

            const formatted = formatShellArgument(key, 1000.01);

            expect(formatted).toMatch(`--key 1000.01`);
        });

        it(`correctly transforms the key for a boolean argument`, () => {
            const key = 'someKey';

            const formatted = formatShellArgument(key, true);

            expect(formatted).toMatch(`--some-key`);
        });

        it(`correctly transforms the key for a string argument`, () => {
            const key = 'someKey';
            const value = 'value';

            const formatted = formatShellArgument(key, value);

            expect(formatted).toMatch(`--some-key value`);
        });
    });
});
