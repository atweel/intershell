import { shell } from '@atweel/intershell';

const name = 'Robby the Robot';

const script = shell`
    echo "Hello from ${ name }!"
`;

script((error, stdout) => {
    if (error) {
        console.error(`Intershell script execution failed. ${ error }`);
    } else {
        console.log(stdout);
    }
});
