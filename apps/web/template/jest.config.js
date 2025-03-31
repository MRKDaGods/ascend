module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transformIgnorePatterns: ["<rootDir>/node_modules/"],
  testMatch: ["**/__tests__/**/*.test.(ts|tsx|js|jsx)"],
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.ts"], // Update the path if necessary
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "\\.(css|scss|sass)$": "identity-obj-proxy", // Mock CSS imports
  },
  extensionsToTreatAsEsm: [".ts", ".tsx"], // Treat TypeScript files as ES modules
  globals: {
    "ts-jest": {
      useESM: true, // Enable ES module support in ts-jest
    },
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}", "!src/**/*.d.ts", "!src/**/index.{ts,tsx,js,jsx}"],
  coverageDirectory: "coverage",
  verbose: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};