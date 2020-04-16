import { shell } from '@atweel/intershell';

const name = 'Robby';

const script = shell`
    echo "Hello ${ name }!"
`;

const output = script.execSync().toString();

console.log(output);
