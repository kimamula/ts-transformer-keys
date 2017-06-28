# ts-transformer-keys
A TypeScript custom transformer which enables to obtain keys of given type.

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Downloads](https://img.shields.io/npm/dm/ts-transformer-keys.svg)](https://www.npmjs.com/package/ts-transformer-keys)

# Requirement
TypeScript >= 2.4.1

# How to use this package

This package exports 2 functions.
One is `keys` which is used in TypeScript codes to obtain keys of given type, while the other is a TypeScript custom transformer which is used to compile the `keys` function correctly.

## How to use `keys`

```ts
import { keys } from 'ts-transformer-keys';

interface Props {
  id: string;
  name: string;
  age: number;
}
const keysOfProps = keys<Props>();

console.log(keysOfProps); // ['id', 'name', 'age']
```

## How to use the custom transformer

Unfortunately, the only way currently available to use custom transformers is to use them with TypeScript compiler API (See https://github.com/Microsoft/TypeScript/issues/14419 for detail).
Something like the following works.

```js
const ts = require('typescript');
const keysTransformer = require('ts-transformer-keys/transformer').default;

const program = ts.createProgram([/* your files to compile */], {
  strict: true,
  noEmitOnError: true,
  target: ts.ScriptTarget.ES5
});

const transformers = {
  before: [keysTransformer(program)],
  after: []
};
const { emitSkipped, diagnostics } = program.emit(undefined, undefined, undefined, false, transformers);

if (emitSkipped) {
  throw new Error(diagnostics.map(diagnostic => diagnostic.messageText).join('\n'));
}
```

As a result, the TypeScript code shown above is compiled into the following JavaScript.

```js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ts_transformer_keys_1 = require("ts-transformer-keys");
var keysOfProps = ["id", "name", "age"];
console.log(keysOfProps); // ['id', 'name', 'age']
```

# Note

* The `keys` function can only be used as a call expression. Writing something like `keys.toString()` results in a runtime error.
* `keys` does not work with a dynamic type parameter, i.e., `keys<T>()` in the following code is converted to an empty array(`[]`).

```ts
class MyClass<T extends object> {
  keys() {
    return keys<T>();
  }
}
```

# License

MIT

[travis-image]:https://travis-ci.org/kimamula/ts-transformer-keys.svg?branch=master
[travis-url]:https://travis-ci.org/kimamula/ts-transformer-keys
[npm-image]:https://img.shields.io/npm/v/ts-transformer-keys.svg?style=flat
[npm-url]:https://npmjs.org/package/ts-transformer-keys
