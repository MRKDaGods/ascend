const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Set the base URL for your local development environment
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
