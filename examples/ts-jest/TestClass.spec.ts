import TestClass from './index'

describe('TestClass', () => {
    test('the method runs', () => {
        const testClass = new TestClass();
        expect(testClass.testMethod()).toEqual(['foo'])
    })
})