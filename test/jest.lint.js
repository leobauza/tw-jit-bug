module.exports = {
  ...require('./jest-common'),
  testEnvironment: 'jest-environment-node',
  displayName: 'eslint',
  runner: 'jest-runner-eslint',
  testMatch: ['<rootDir>/**/*.js'],
}
