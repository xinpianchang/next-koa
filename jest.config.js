// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  bail: true,
  clearMocks: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'jest.setup.js'
  ],
  coverageReporters: [
    'json',
    'text',
    'lcov',
    'clover'
  ],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.json'
    }
  },
  moduleFileExtensions: [
    'js',
    'json',
    'jsx',
    'ts',
    'tsx',
    'node'
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/__mocks__/mocks.js',
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/mocks.js'
  },
  preset: 'ts-jest',
  rootDir: 'test',
  // setupFiles: [ '<rootDir>/jest.setup.js' ],
  globalSetup: '<rootDir>/jest-global-setup.js',
  globalTeardown: '<rootDir>/jest-global-teardown.js',
  testEnvironment: '<rootDir>/jest-environment.js',
  testMatch: [
    '**/?(*.)+(spec|test).[tj]s?(x)'
  ],
  testPathIgnorePatterns: [
    './.next/',
    './node_modules/'
  ],
  transformIgnorePatterns: [
    '/node_modules/'
  ],
  verbose: true,
}
