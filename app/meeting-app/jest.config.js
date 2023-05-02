module.exports = {
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleNameMapper: {
      '^axios$': '<rootDir>/__mocks__/axios.js',
    },
    testEnvironment: 'jsdom',
  };
  