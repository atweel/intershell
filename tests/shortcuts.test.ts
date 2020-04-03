import 'reflect-metadata';

import * as shells from 'intershell';

const shortcuts = Object.entries(shells)
    .filter(([ name, value ]) => typeof value === 'function' && name !== 'shell')
    .filter(([ , value ]) => Reflect.hasMetadata(shells.TAG_FUNCTION_METADATA_KEY, value))
    .map(([ name, value ]) => ({
        name,
        tag: value,
        metadata: Reflect.getMetadata(shells.TAG_FUNCTION_METADATA_KEY, value),
    }));


for (const shortcut of shortcuts) {
    describe(`'${ shortcut.name }' template literal tag...`, function () {
        describe(`...invoked without parameters...`, function () {
            it(`...executes the given script using /bin/${ shortcut.name } interpreter...`, function () {
                if (typeof shortcut.tag !== 'function') {
                    throw new Error(`Expected a template tag function, but ${ shortcut.tag } is (a/an) ${ typeof shortcut.tag }`);
                }

                const script = shortcut.tag`echo SHELL = $0`;

                return new Promise((resolve, reject) => {
                    script({}, (error, stdout) => {
                        if (error) {
                            reject(error);
                        }

                        expect(stdout.toString()).toMatch(new RegExp(`SHELL = ${ shortcut.metadata.interpreter }`));

                        resolve();
                    });
                });
            });
        });
    });
}

