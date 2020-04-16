![Validation on master](https://github.com/atweel/intershell/workflows/Integrate%20master%20branch/badge.svg?branch=master&event=push)

# Intershell

Intershell is a utility package that allows developers to write and execute linux shell scripts as part of their Javascript/TypeScript applications for Node.js by leveraging the power of ES2015 [tagged template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals). Intershell's `shell` function provides a simple interface that allows for executing template-literal-formatted scripts using the default or a custom interpreter both in synchronous and asynchronous mode, configuring parameters of the interpreter process, as well as compiling a script into a string that can be executed manually. For detailed guidelines and examples of using Intershell, please refer to the [package's readme](package/readme.md).

## Contributing

### Repository structure and tools

This repostitory is structured as a [`lerna`](https://www.npmjs.com/packages/lerna) monorepo that contains two packages. The `package` directory contains source code of the Intershell package itself, while the `primer` directory contains an auxillary `intershell-primer` package that is used to showcase the features of Intershell and generating code samples for documentation. For the purpose of development and testing, the following tools and packages are included as development dependencies:
- [`yarn`](https://www.npmjs.com/packages/yarn) is the package manager we use,
- [`command-exists`](https://www.npmjs.com/packages/command-exists) is used in the `intershell-primer` package to find out which interpreters are available on the system,
- [`eslint`](https://www.npmjs.com/packages/eslint) with [`@typescript-eslint/parser`](https://www.npmjs.com/packages/@typescript-eslint/parser) and [`@typescript-eslint/eslint-plugin`](https://www.npmjs.com/packages/@typescript-eslint/eslint-plugin) is the linting tool of our choice,
- [`husky`](https://www.npmjs.com/packages/husky) is used to configure and run git hooks, specifically the `pre-commit` hook that is used for building and testing packages prior to commit,
- [`jest`](https://www.npmjs.com/packages/jest) with [`ts-jest`](https://www.npmjs.com/packages/ts-jest) preset is our tool for unit and integration testing,
- [`lerna`](https://www.npmjs.com/packages/lerna), as mentioned, is used to organize the repository,
- [`ts-node` ](https://www.npmjs.com/packages/ts-node)is used to run primer without preeliminary transpilation,
- [`typescript`](https://www.npmjs.com/packages/typescript) is the standard compiler for TypeScript, and finally
- [`ttypescript`](https://www.npmjs.com/packages/ttypescript) is a wrapper on top of [`typescript`](https://www.npmjs.com/packages/typescript) that adds support for applying code transformations during transpilation process.

In this repository, we aim to automate as many routine operations as possible.

### Preferred IDE

We prefer [VS Code](https://code.visualstudio.com/) with [`devcontainer`](https://code.visualstudio.com/docs/remote/containers) support as out IDE which allows us to maintan a standard configuraton of the development environent and sharing as part of the repository. The [`devcontainer`](https://code.visualstudio.com/docs/remote/containers) includes all non-npm dependencies that we have found useful during development process.

### Getting started with the repository

After you've cloned the repository, you will nened to run `lerna bootstrap` command to install dependencies and cross-link repository packages. 
If you're developing with VS Code against a [`devcontainer`](https://code.visualstudio.com/docs/remote/containers), [`lerna`](https://www.npmjs.com/packages/lerna) is available insdide the cotnainer out of the box. Otherwise, you need to have [`lerna`](https://www.npmjs.com/packages/lerna) installed globally on your development machine.

### Building the packages

To build packages, run `yarn build`. This script builds the `intershell` package using the `ttypescript` compiler. Please note that `intershell-primer` is not required to be built as it is supposed to be run via [`ts-node`](https://www.npmjs.com/package/ts-node). If you want to have a clean build, run `yarn rebuild` instead. This script cleans all package outouts as well as other generated files such as coverage reports.

### Testing your code

Intershell includes unit and integration tests. Unit tests are located in the sources directory of the `intershell` package and are named after respective code files with an additiopn of `spec` before extension, e.g. `shell.spec.ts`. Unit tests ensure that the package's API is working as expected in clean conditions with most dependecies replacesd by mocks.

Integration tests are maintained outside the package code and are located in the tests directory at repository root. Unlike unit tests that import specific modules from the package under test, these tests import the package as a whole emulating the way a dependent pakcage would use `intershell`. Thus, integration tests test the pakcage's API as seen by client code. Integration tests do not mock any dependencies and therefore start real interpreter processes to run `intershell` scripts. This limits the number of interpreters that can be tested on a particular machine to those interpreters that are available there. If an interpreter is not available, the respective test will be skipped.

Both unit and integration tests are run as part of the `integration` script that is used to validate commits and builds. A minimum coverage of 85% for each of branches, functions, lines, and statements is formally required by jest configuration. However, as the package is relatively tiny, we aim at maintaining code coverage close to 100% (not less than 95.56% at the time of writing). If you're adding new code, please make sure to add tests to cover it. If you're uggesting a change to existing behavior, please change related tests accordingly.

### Integration

We use the term 'integration' to refer to the entire process of building and testing the code. Integration script is run as part of the a pre-commit hook, as well as during server-side builds. As the final stage, integration script uses primer to update the package's readme with fresh code samples. Integration does not include building and publishing the package itself. These operations are executed separately on the build servers.

Contributions in the form of issues and PRs are always welcome. For additional information on the topic, please refer to [contributing.md](contributing.md).

## Dependencies

As of version [`1.0.0.beta-6`](https://www.npmjs.com/package/@atweel/intershell/v/1.0.0-beta.6), `intershell` has three runtime dependencies: [`debug`](https://www.npmjs.com/package/debug), [`param-case`](https://www.npmjs.com/package/param-case), and [`reflect-metadata`](https://www.npmjs.com/package/reflect-metadata). Please note that at the time of writing, the `reflect-metadata` API is not yet standardized and may change in the future which might require potentially breaking changes in `intershell`.

## License

This software is licensed under the [MIT](https://opensource.org/licenses/MIT) license as detailed below.

---

Copyright 2020 Atweel Inc.

Copyright 2020 Eduard Malakhov

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

---