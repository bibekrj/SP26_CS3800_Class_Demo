// jest.config.js
// this tells Jest to handle ES Modules (import/export) properly
// ES modules are javascripts standard system for structuring and reusing JavaScript code

export default {
  // dont need to transform files bc they're already valid ES modules
  transform: {},
  
  // setting the test environment to node (instead of jsdom which is default)
  testEnvironment: 'node',
  
  // regex on where we can find tests
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  //optional - this tells Jest to collect coverage information from all .js files in src, except for test files and server.js
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/server.js'
  ]
};