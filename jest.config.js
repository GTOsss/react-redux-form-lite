const { resolve } = require('path');

module.exports = {
  verbose: true,
  setupFilesAfterEnv: ['jest-enzyme'],
  testEnvironment: 'enzyme',
  globalSetup: resolve(__dirname, 'setup-test.js'),
  testEnvironmentOptions: {
    enzymeAdapter: 'react16',
  },
  preset: 'ts-jest',
  // moduleFileExtensions: [
  //   'ts',
  //   'tsx',
  //   'js',
  //   'jsx',
  //   'json',
  //   'node'
  // ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '^.+\\.js': 'babel-jest',
  },
  // preset: 'ts-jest',
  // roots: [
  //   './src'
  // ],
  // transform: {
  //   '^.+\\.tsx?$': 'ts-jest',
  // },
};
