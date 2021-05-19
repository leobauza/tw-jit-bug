module.exports = {
  ...require('./jest-common'),
  testEnvironment: 'jest-environment-node',
  displayName: 'stylelint',
  runner: 'stylelint',
  moduleFileExtensions: ['css'],
  testMatch: ['<rootDir>/src/css/**/*.css'],
}
