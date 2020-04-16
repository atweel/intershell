import commandExists from 'command-exists';

import { sh, bash, dash, zsh } from '@atweel/intershell';

if (commandExists.sync('sh')) {
    const output = sh`echo "Hello from $0"`.execSync();

    console.log(`${ output } (sh tag function)`);
} else {
    console.log(`Command 'sh' is not available on this system.`);
}

if (commandExists.sync('bash')) {
    const output = bash`echo "Hello from $0"`.execSync();

    console.log(`${ output } (bash tag function)`);
} else {
    console.log(`Command 'bash' is not available on this system.`);
}

if (commandExists.sync('dash')) {
    const output = dash`echo "Hello from $0"`.execSync();

    console.log(`${ output } (dash tag function)`);
} else {
    console.log(`Command 'dash' is not available on this system.`);
}

if (commandExists.sync('zsh')) {
    const output = zsh`echo "Hello from $0"`.execSync();

    console.log(`${ output } (zsh tag function)`);
} else {
    console.log(`Command 'zsh' is not available on this system.`);
}

