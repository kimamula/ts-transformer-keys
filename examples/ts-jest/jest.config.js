module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      // Relative path from the folder where jest.config.js is located
      astTransformers: ['ts-jest-keys-transformer.js'],
    },
  }
};