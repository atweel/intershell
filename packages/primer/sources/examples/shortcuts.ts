import commandExists from 'command-exists';
import { sh, bash, dash, zsh } from '@atweel/intershell';

commandExists('sh')
    .then(() => {
        sh`echo "Hello from $0"`((error, stdout) => {
            console.log(`${ stdout } (sh)`);
        });
    }).catch(() => {
        console.log(`Command 'sh' is not available on this system.`);
    });

commandExists('bash')
    .then(() => {
        bash`echo "Hello from $0"`((error, stdout) => {
            console.log(`${ stdout } (bash)`);
        });
    }).catch(() => {
        console.log(`Command 'bash' is not available on this system.`);
    });

commandExists('dash')
    .then(() => {
        dash`echo "Hello from $0"`((error, stdout) => {
            console.log(`${ stdout } (dash)`);
        });
    }).catch(() => {
        console.log(`Command 'dash' is not available on this system.`);
    });

commandExists('zsh')
    .then(() => {
        zsh`echo "Hello from $0"`((error, stdout) => {
            console.log(`${ stdout } (zsh)`);
        });
    }).catch(() => {
        console.log(`Command 'zsh' is not available on this system.`);
    });

