module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],


  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Ensure Jest recognizes all file extensions
  testEnvironment: 'jsdom', // Ensure the correct test environment is used
  setupFilesAfterEnv: ['./jest.setup.js'], // Add the Jest setup file
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1', // Map @ to the src directory
  },
};