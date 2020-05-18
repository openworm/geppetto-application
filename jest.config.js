module.exports = {
  "preset": "jest-puppeteer",
  "testRegex": "(tests/jest-puppeteer/Test.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  "testPathIgnorePatterns": [
      "/node_modules/",
      "<rootDir>/geppetto-client/__tests__/*"
    ]
};
