module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: [
    "/node_modules/",
  ],
  modulePathIgnorePatterns: ['__tests__/mocks'],
  testMatch: [
    "**/__tests__/**/*.[jt]s?(x)",
  ],
  moduleNameMapper: {
    "^\\$constants(.*)$": "<rootDir>/constants$1",
    "^\\$utils(.*)$": "<rootDir>/utils$1",
    "^\\$domain(.*)$": "<rootDir>/domain$1",
  },
  rootDir: './src/'
};
