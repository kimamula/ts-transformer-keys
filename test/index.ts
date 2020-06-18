import { keys } from '../index';
import assert from 'assert';
import path from 'path';
import fs from 'fs';
import { compile } from './compile/compile';
import ts from 'typescript';

describe('keys', () => {
  it('should return keys of given type', () => {
    assert.deepStrictEqual(keys(), []);
    assert.deepStrictEqual(keys<any>(), []);
    interface Foo {
      foo: string;
    }
    assert.deepStrictEqual(keys<Foo>(), ['foo']);
    type FooBar = {
      foo: string;
      bar?: number;
    };
    assert.deepStrictEqual(keys<FooBar>(), ['foo', 'bar']);
    interface BarBaz {
      bar: Function;
      baz: Date;
    }
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
