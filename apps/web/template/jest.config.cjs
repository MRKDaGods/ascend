module.exports = {
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest", // Use babel-jest to transpile TypeScript and JSX
  },
  testEnvironment: "jsdom", // Use jsdom for DOM testing
  setupFilesAfterEnv: ["<rootDir>/src/tests/setupTests.ts"], // Optional: Add setup file
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1", // Optional: Alias for imports
  },
};