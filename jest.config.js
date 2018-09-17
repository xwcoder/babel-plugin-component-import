module.exports = {
  testEnvironment: 'node',
  testRegex: 'test/index.js',
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  moduleFileExtensions: [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ],
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  collectCoverageFrom: [
    'src/**/*.{js, jsx}',
    '!**/__tests__/**'
  ]
}
