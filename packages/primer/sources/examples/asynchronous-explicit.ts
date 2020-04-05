import { shell } from '@atweel/intershell';

const name = 'Robby';

const script = shell`
    echo "Hello ${ name }!"
`;

script.execAsync((error, stdout) => {
    if (error) {
        console.error(`Intershell script execution failed. ${ error }`);
    } else {
        console.log(stdout);
    }
});
