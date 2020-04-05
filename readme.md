![Validation on master](https://github.com/atweel/intershell/workflows/Integrate%20master%20branch/badge.svg?branch=master&event=push)

# Intershell

## About

Intershell leverages the power of ES2015 [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) to embed and execute Linux shell scripts directly from Node.js applications.

## Usage examples

### Basic usage

The easiest way of including a shell script into your code with Intershell is to write it as a template literal and apply the `shell` tag available from the Intershell package like this:

<!---example:basic:begin--->
```typescript
// Source code:
import { shell } from '@atweel/intershell';

const name = 'Robby';

const script = shell`
    echo "Hello ${ name }!"
`;

script((error, stdout) => {
    if (error) {
        console.error(`Intershell script execution failed. ${ error }`);
    } else {
        console.log(stdout);
    }
});

// Output:
// Hello Robby!
```
<!---example:basic:end--->

Applying the `shell` tag to a template literal produces a function, invoking which will asynchronously execute the shell script defined by the template literal using the `/bin/sh` interpreter by default. Script function accepts zero to two arguments, the last one being a callback that will be called when the script exits. When invoked, the callback will be passed two arguments: an error (`null` if the script exits with code zero) and a string containing the ouput that the script has produced. The script function returns an instance of [`ChildProcess`](https://nodejs.org/dist/latest-v12.x/docs/api/child_process.html#child_process_class_childprocess) similarly to the `exec` API from the standard Node.js `child_process` package.

As with regular template literals, one can use substitutions to shape the scripts produced by Intershell as in the following example. Values of the following types are supported: `boolean`,`string`, `number`, other types need to be converted to string explicitly.

```typescript
import { shell } from 'intershell';

const name = 'Robby';

const script = shell`echo "Hello from ${ name }!"`;

script((error, stdout) => {
    if (!error) {
        console.log(stdout);
    } else {
        console.error(`Error: ${ error }.`);
    }
});
```

### Synchronous vs. asynchronous execution

By default, Intershell scripts are executed asynchronously. To support synchronous execution, Intershell script function exposes a method called `execSync` which would start the interpreter in s separate process, wait for it to finish execution, and return the output as a `Buffer` or a `string` similarly to the `execSync` API from the standard Node.js `child_process` package. 

<!---example:synchronous:begin--->
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

```typescript
import { promisify } from 'util';
import { shell } from 'intershell';

const name = 'Robby';

const script = promisify(shell`echo "Hello from ${ name }!"`);

script.then((stdout) => {
    console.log(stdout);
});
```

### Custom interpreters

By default, intershell scripts are executed under the `/bin/sh` interpreter; however intershell provides support for custom interpreters. A custom interpreter can be passed as an argument to the `shell` function as follows.

```typescript
import { shell } from 'intershell';

const script = shell('/bin/bash')`echo "Hello from $SHELL"`;

const output = script.execSync();

console.log(output);
```

For convenience, intershell provides build-in shortcuts for the three most supported interpreters: `sh`, `bash`, `zsh`. Please note, that `sh` is an alias for `shell` as `shell` uses `/bin/sh` by default.

```typescript
import { sh, bash, zsh } from 'intershell';

console.log(sh`echo "Hello from $SHELL"`.execSync().toString());

console.log(bash`echo "Hello from $SHELL"`.execSync().toString());

console.log(zsh`echo "Hello from $SHELL"`.execSync().toString());
```

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