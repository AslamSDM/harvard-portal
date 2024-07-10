module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // Ensure you're using the jsdom environment
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Adjust based on your paths configuration
  },
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.json' // Explicitly point to your tsconfig
    }
  },
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Ensure ts-jest is used for TypeScript and TSX files
  },
  // Add any other configuration you need here
};