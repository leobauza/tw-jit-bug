module.exports = {
  collectCoverageFrom: ['./src/**/*.js'],
  coverageThreshold: {
    global: {
      statements: 5,
      branches: 0,
      functions: 5,
      lines: 5,
    },
  },
  projects: [
    './test/jest.client.js',
    './test/jest.lint.js',
    './test/jest.stylelint.js',
  ],
}
