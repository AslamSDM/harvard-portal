module.exports = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
    moduleNameMapper: {
      // Handle module aliases (if you have them in your next.config.js)
      '^@components/(.*)$': '<rootDir>/components/$1',
    },
    testEnvironment: 'jsdom',
  };