const { resolve } = require('path');

module.exports = {
  verbose: true,
  setupTestFrameworkScriptFile: 'jest-enzyme',
  testEnvironment: 'enzyme',
  globalSetup: resolve(__dirname, 'setup-test.js'),
  testEnvironmentOptions: {
    enzymeAdapter: 'react16',
  },
};
