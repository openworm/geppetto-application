module.exports = {
  "preset": "jest-puppeteer",
  "testRegex": "(tests/jest-puppeteer/Test.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  "testPathIgnorePatterns": [
    "<rootDir>/node_modules/",
    "<rootDir>/geppetto-client/",
    "<rootDir>/geppetto-client/__tests__/",
    "<rootDir>/tests/casperjs"
  ]
};
