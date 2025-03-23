module.exports = {
  presets: [
    "@babel/preset-env",
    "@babel/preset-react", // Ensure React JSX is supported
    "@babel/preset-typescript" // Ensure TypeScript is supported
  ],
  plugins: [
    "@babel/plugin-transform-runtime", // Optimize Babel output
    "@babel/plugin-syntax-jsx" // Ensure JSX syntax is parsed
  ],
  env: {
    test: {
      presets: [
        "@babel/preset-env",
        "@babel/preset-react",
        "@babel/preset-typescript"
      ],
      plugins: [
        "@babel/plugin-transform-runtime",
        "@babel/plugin-syntax-jsx"
      ]
    }
  }
};
