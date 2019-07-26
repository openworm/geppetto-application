module.exports = { 
  "preset": "jest-puppeteer", 
  "testRegex": "(/__tests__/Test.*|(\\.|/)(test|spec))\\.[jt]sx?$",
  "testPathIgnorePatterns" : ["__tests__/TestPersistence.js"]
};