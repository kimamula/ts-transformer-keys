import { keys } from 'ts-transformer-keys';
interface Foo {
  foo: string;
}

export default class TestClass {
  testMethod(){
    keys();
    const fooKeys = keys<Foo>();
    return fooKeys
  }
}
