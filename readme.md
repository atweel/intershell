<p align="center">
    INTERSHELL
</p>

<p align="center">

</p>

## About

Intershell leverages the power of ES2015 [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) to embed and execute Linux shell scripts directly from Javascript/TypeScript code.

## Usage examples

### Basic usage

The easiest way of including a shell script into your code with Intershell is to write it as a template literal and apply the `shell` tag available from the Intershell package like this:

```typescript
import { shell } from 'intershell';

const script = shell`echo "Hello from an Intershell script!"`;

script();
```

Applying the `shell` tag to a template literal produces a function, invoking which will asynchronously execute the the code defined by the template literal using the `/bin/sh` interpreter. This function returns an instance of [`ChildProcess`](https://nodejs.org/dist/latest-v12.x/docs/api/child_process.html#child_process_class_childprocess) similarly to the `exec` API from the standard Node.js `child_process` package.

As with regular template literals, one can use substitutions to shape the scripts produced by Intershell like in the following example.

```typescript
import { shell } from 'intershell';

const name = 'Robby';

const script = shell`echo "Hello from ${ name }!"`;

script();
```

### Synchronous vs. asynchronous execution

By default, Intershell scripts get executed asynchronously. To invoke the script synchronously, Intershell script function exposes a method called `execSync` which would start the interpreter in s separate process, wait for it to finish execution, and return the output as a `Buffer` similarly to the `execSync` API from the standard Node.js `child_process` package. 

```typescript
import { shell } from 'intershell';

const name = 'Robby';

const script = shell`echo "Hello from ${ name }!"`;

const output = script.execSync();

console.log(output.toString());
```

Output:
```shell
# TBD
```

For the sake of API symmetry, Intershell script functions also expose the `execAsync` method which does exactly the same as the direct invocation.

```typescript
import { shell } from 'intershell';

const name = 'Robby';

const script = shell`echo "Hello from ${ name }!"`;

script.execAsync();
```


## Dependencies
[TBD]

## Contributing
[TBD]

## License

Copyright 2020 Atweel Inc.
Copyright Eduard Malakhov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.