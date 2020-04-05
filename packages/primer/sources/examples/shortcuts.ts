import { sh, bash, dash, zsh } from '@atweel/intershell';

sh`echo "Hello from $0"`((error, stdout) => {
    console.log(`${ stdout } (sh)`);
});

bash`echo "Hello from $0"`((error, stdout) => {
    console.log(`${ stdout } (bash)`);
});

dash`echo "Hello from $0"`((error, stdout) => {
    console.log(`${ stdout } (dash)`);
});

zsh`echo "Hello from $0"`((error, stdout) => {
    console.log(`${ stdout } (zsh)`);
});
