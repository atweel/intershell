import { promisify } from 'util';

import { shell } from '@atweel/intershell';

const name = 'Robby';

const script = promisify(shell`echo "Hello from ${ name }!"`);

script().then((stdout) => {
    console.log(stdout);
});
