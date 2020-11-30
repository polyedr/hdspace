module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/'],
  modulePathIgnorePatterns: ['__tests__/mocks', '__tests__/test-utils.tsx'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)'],
  moduleNameMapper: {
    '^@Components(.*)$': '<rootDir>/components$1',
    '^@Constants(.*)$': '<rootDir>/constants$1',
    '^@Utils(.*)$': '<rootDir>/utils$1',
    '^@Redux(.*)$': '<rootDir>/redux$1',
    '^@Api(.*)$': '<rootDir>/api$1',
    '^@Domain(.*)$': '<rootDir>/domain$1',
    '^@Src(.*)$': '<rootDir>$1',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/utils/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': '<rootDir>/utils/__mocks__/styleMock.js',
  },
  rootDir: './src/',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
};
