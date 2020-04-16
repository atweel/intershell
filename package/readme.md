# Intershell

Intershell is a utility package that allows for linux shell scripts to be embedded into and executed directly from Javascript/TypeScript code of your Node.js applications by leveraging the power of ES2015 [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals). Intershell exports a function called `shell` that can serve both as a tag function that turns template string literals into executable script functions; and a factory function for producing specialized tag functions. The example below deminstrates how `shell` can be used as a tag function to wrap a shell script into a function.

<!---example:basic:begin--->
<!---
    The code sample below was generated automatically by the primer utility; do not edit.
    Last update on Thu, 16 Apr 2020 05:55:02 GMT.
--->
```typescript
// Source code:
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

// Output:
// Hello from Robby the Robot!
```
<!---example:basic:end--->

When `shell` is applied to a template literal as in the example above, it produces a function that will start a separate interpreter process to execute the specified script once invoked. By default, intershell uses `/bin/sh` as the interpreter and the script is executed asynchronously, however both [custom interpreters](#Using-a-custom-shell-interpreter) and [synchronous execution]((#synchronous-vs.-asynchronous-execution)) are supported. The function produced by `shell` (aka *intershell script function*) accepts zero to two arguments. These arguments can be a `parameters` object discussed [below](), a callback, both, or none. When a callback is specified, it will be called once the script exits with two arguments: an `error` which can be of any type and an `stdout` (`string` or `Buffer`) containing the output produced by the script. If the script exits with a zero, `error` is null, otherwise `error` contains information about the error.

### Using a custom shell interpreter

As noted previously, when intershell executes scripts, it uses `/bin/sh` as the interpreter by default. Althouth `/bin/sh` seems to be a reasonable choice in most situations, sometimes you might want to specify an interpreter explicitly. For that case, intershell's `shell` function can be invoked as a "regular" (non-tag) function and be provided with a a full path to an interpretere or a command name that can be resolved by the system. The example below demonstrates this. Here, we call `shell` to create a tag function that is bound to the specified interpreter which is `/bin/bash` in this case. Then, we use this tag function in place of `shell` to compile a script function. As seen from the output, the script in this example is actually executed under `/bin/bash` (variable `$0` within a script refers to the executable).

<!---example:custom-interpreter:begin--->
<!---
    The code sample below was generated automatically by the primer utility; do not edit.
    Last update on Thu, 16 Apr 2020 05:55:02 GMT.
--->
```typescript
// Source code:
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

// Output:
// /bin/bash
```
<!---example:custom-interpreter:end--->

For convenience, intershell package provides shortcuts for the four most used interpreters, namely `/bin/bash`, `/bin/dash`, `/bin/zsh`, and `/bin/sh`.

<!---example:shortcuts:begin--->
<!---
    The code sample below was generated automatically by the primer utility; do not edit.
    Last update on Thu, 16 Apr 2020 05:55:02 GMT.
--->
```typescript
// Source code:
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


// Output:
// Hello from /bin/sh
//  (sh tag function)
// Hello from /bin/bash
//  (bash tag function)
// Hello from /bin/dash
//  (dash tag function)
// Hello from /bin/zsh
//  (zsh tag function)
```
<!---example:shortcuts:end--->

### Synchronous vs. asynchronous execution

As already stated, Intershell scripts are executed asynchronously by default. To support synchronous execution, Intershell script function exposes a method called `execSync` which starts the interpreter in s separate process, waits for it to finish execution, and returns the output as a `Buffer` or a `string` similarly to the `execSync` API from the standard Node.js `child_process` package. 

<!---example:synchronous:begin--->
<!---
    The code sample below was generated automatically by the primer utility; do not edit.
    Last update on Thu, 16 Apr 2020 05:55:02 GMT.
--->
```typescript
// Source code:
import { shell } from '@atweel/intershell';

const name = 'Robby';

const script = shell`
    echo "Hello ${ name }!"
`;

const output = script.execSync().toString();

console.log(output);

// Output:
// Hello Robby!
```
<!---example:synchronous:end--->

For the sake of API symmetry, Intershell script functions also expose the `execAsync` method which does exactly the same as the direct invocation.

<!---example:asynchronous-explicit:begin--->
<!---
    The code sample below was generated automatically by the primer utility; do not edit.
    Last update on Thu, 16 Apr 2020 05:55:02 GMT.
--->
```typescript
// Source code:
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

// Output:
// Hello Robby!
```
<!---example:asynchronous-explicit:end--->

### Support for promises

Intershell scripts support promises via the standard `promisify` mechanism from the `util` package for Node.js.

<!---example:promises:begin--->
<!---
    The code sample below was generated automatically by the primer utility; do not edit.
    Last update on Thu, 16 Apr 2020 05:55:02 GMT.
--->
```typescript
// Source code:
import { promisify } from 'util';

import { shell } from '@atweel/intershell';

const name = 'Robby';

const script = promisify(shell`echo "Hello from ${ name }!"`);

script().then((stdout) => {
    console.log(stdout);
});

// Output:
// Hello from Robby!
```
<!---example:promises:end--->

### Parameterised scripts

As with regular interpolated template literals, one can use variables that are in the scope of the template to customise the script that is being generated by intershell. But what if we wanted to make a script that is callable with different parameters? To achieve this, one can use the gneric form of the `shell` function as shown below.

<!---example:parameters:begin--->
<!---
    The code sample below was generated automatically by the primer utility; do not edit.
    Last update on Thu, 16 Apr 2020 05:55:02 GMT.
--->
```typescript
// Source code:
import { shell } from '@atweel/intershell';

const script = shell<{
    name: string;
}>`
    echo "Hello from ${ ({ name }) => name }!"
`;

console.log(script.execSync({ name: 'Richie' }).toString());
console.log(script.execSync({ name: 'Megan' }).toString());

// Output:
// Hello from Richie!
// 
// Hello from Megan!
```
<!---example:parameters:end--->

## Dependencies

As of version 1.0.0, intershell has only two runtime dependencies: [`debug`](https://www.npmjs.com/package/debug) and 
[`reflect-metadata`](https://www.npmjs.com/package/reflect-metadata). Please note, that `reflect-metadata` API is not yet standardized and may change in the future.

## Contributing

Contributions in the form of issues and PRs are always welcome. For additional information on the topic, please refer to [contributing.md](contributing.md).

## License

This software is licensed under the [MIT](https://opensource.org/licenses/MIT) license as detailed below.

---

Copyright 2020 Atweel Inc.

Copyright 2020 Eduard Malakhov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---