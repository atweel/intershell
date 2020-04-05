import { shell } from '@atweel/intershell';

const script = shell<{
    name: string;
}>`
    echo "Hello from ${ ({ name }) => name }!"
`;

console.log(script.execSync({ name: 'Richie' }).toString());
console.log(script.execSync({ name: 'Megan' }).toString());
