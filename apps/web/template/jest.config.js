module.exports = {
  transform: {
    '^.+\\.(ts|tsx|js|jsx)?$': ['babel-jest', { configFile: './src/app/babel.config.cjs' }] // Explicitly specify Babel config
  },
  transformIgnorePatterns: [
    '/node_modules/' // Ensure Jest processes all files, including those in node_modules that might require transformation
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Ensure Jest recognizes all file extensions
  testEnvironment: 'jsdom', // Ensure the correct test environment is used
  setupFilesAfterEnv: ['./jest.setup.js'], // Add the Jest setup file
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Map @ to the src directory
  },
};