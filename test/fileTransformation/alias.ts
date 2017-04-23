import { keys as k } from '../../index';

k();

interface Foo {
  foo: string;
}
const fooKeys = k<Foo>();
console.log(fooKeys[0]);

type FooBar = Foo & { bar: number; };
k<FooBar>()[1];
type FooBarBaz = FooBar | { bar: Function; baz: Date; };
const fooBarBazKeys = k<FooBarBaz>();
fooBarBazKeys.forEach(key => console.log(key));

function keys() {
  return '';
}
const a = keys();

k.toString();

class MyClass<T extends object> {
  keys() {
    return k<T>();
  }
}
