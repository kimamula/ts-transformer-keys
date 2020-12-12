import {typeMembers, keys} from '../index';
import assert from 'assert';
import path from 'path';
import fs from 'fs';
import { compile } from './compile/compile';
import ts from 'typescript';

interface Foo {
  foo: string;
}

type FooBar = {
  foo: string;
  bar?: number;
};

interface BarBaz {
  bar: Function;
  baz: Date;
}

describe('keys', () => {
  it('should return keys of given type', () => {
    assert.deepStrictEqual(keys(), []);
    assert.deepStrictEqual(keys<any>(), []);
    assert.deepStrictEqual(keys<Foo>(), ['foo']);
    assert.deepStrictEqual(keys<FooBar>(), ['foo', 'bar']);
    assert.deepStrictEqual(keys<FooBar & BarBaz>(), ['foo', 'bar', 'baz']);
    assert.deepStrictEqual(keys<FooBar | BarBaz>(), ['bar']);
    assert.deepStrictEqual(keys<FooBar & any>(), []);
    assert.deepStrictEqual(keys<FooBar | any>(), []);
  });
  const fileTransformationDir = path.join(__dirname, 'fileTransformation');
  fs.readdirSync(fileTransformationDir).filter((file) => path.extname(file) === '.ts').forEach(file =>
    (['ES5', 'ESNext'] as const).forEach(target =>
      it(`should transform ${file} as expected when target is ${target}`, async () => {
        let result = '';
        const fullFileName = path.join(fileTransformationDir, file), postCompileFullFileName = fullFileName.replace(/\.ts$/, '.js');
        compile([fullFileName], ts.ScriptTarget[target], (fileName, data) => postCompileFullFileName === path.join(fileName) && (result = data));
        assert.strictEqual(result.replace(/\r\n/g, '\n'), fs.readFileSync(fullFileName.replace(/\.ts$/, `.${target}.js`), 'utf-8'));
      }).timeout(0)
    )
  );
});

describe('typeMembers', () => {
  it('should return type members of given type', () => {
    assert.deepStrictEqual(typeMembers(), {});
    assert.deepStrictEqual(typeMembers<any>(), {});
    assert.deepStrictEqual(typeMembers<Foo>(), {foo: 'string'});
    assert.deepStrictEqual(typeMembers<FooBar>(), {foo: 'string', bar: 'number | undefined'});
    assert.deepStrictEqual(typeMembers<FooBar & BarBaz>(), {foo: 'string', bar: 'number & Function', baz: 'Date'});
    assert.deepStrictEqual(typeMembers<FooBar | BarBaz>(), {bar: 'number | Function | undefined'});
    assert.deepStrictEqual(typeMembers<FooBar & any>(), {});
    assert.deepStrictEqual(typeMembers<FooBar | any>(), {});
  });
});
