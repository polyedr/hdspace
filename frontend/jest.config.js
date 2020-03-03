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
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/utils/__mocks__/fileMock.js",
    "\\.(css|less)$": "<rootDir>/utils/__mocks__/styleMock.js"
  },
  rootDir: './src/'
};
