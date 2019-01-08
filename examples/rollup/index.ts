import { keys } from 'ts-transformer-keys';

keys();

interface Foo {
  foo: string;
}
const fooKeys = keys<Foo>();
console.log(fooKeys[0]);

type FooBar = Foo & { bar: number; };
console.log(keys<FooBar>()[1]);
type FooBarOrBarBaz = FooBar | { bar: Function; baz: Date; };
const fooBarOrBarBazKeys = keys<FooBarOrBarBaz>();
fooBarOrBarBazKeys.forEach(key => console.log(key));
