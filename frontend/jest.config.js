module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/'],
  modulePathIgnorePatterns: ['__tests__/mocks'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/utils/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': '<rootDir>/utils/__mocks__/styleMock.js',
  },
  rootDir: './src/',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
};
