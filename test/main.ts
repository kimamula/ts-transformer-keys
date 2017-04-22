import { keys } from '../index';
import * as assert from 'assert';
import * as path from 'path';
import * as fs from 'fs';
import { compile } from './compile';

describe('keys', () => {
  it('return keys of given type', () => {
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
  fs.readdirSync(fileTransformationDir).filter((file) => path.extname(file) === '.ts').forEach((file) =>
    it(`transforms ${file} as expected`, () => {
      let result = '';
      const fullFileName = path.join(fileTransformationDir, file), postCompileFullFileName = fullFileName.replace(/\.ts$/, '.js');
      compile([fullFileName], (fileName, data) => postCompileFullFileName === fileName && (result = data));
      assert.strictEqual(result, fs.readFileSync(postCompileFullFileName, 'utf-8'));
    }).timeout(0)
  );
});
