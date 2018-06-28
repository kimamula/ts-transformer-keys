import { keys } from 'ts-transformer-keys';

keys();

interface Foo {
  foo: string;
}
const fooKeys = keys<Foo>();
console.log(fooKeys[0]);

type FooBar = Foo & { bar: number; };
keys<FooBar>()[1];
type FooBarBaz = FooBar | { bar: Function; baz: Date; };
const fooBarBazKeys = keys<FooBarBaz>();
fooBarBazKeys.forEach(key => console.log(key));
