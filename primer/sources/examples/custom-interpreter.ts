import { shell } from '@atweel/intershell';

const bashShell = shell('/bin/bash');

const script = bashShell`
    echo "$0"
`;

script((error, stdout) => {
    if (error) {
        console.error(`Intershell script execution failed. ${ error }`);
    } else {
        console.log(stdout);
    }
});
