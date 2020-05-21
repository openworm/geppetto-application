module.exports = {
  extends: [
    "./geppetto-client/geppetto-client/.eslintrc.js"
  ],
  plugins: ["jest"],
  globals: {
    page: true,
    browser: true,
    context: true,
    jestPuppeteer: true,
    acnet2: true,
    c302: true,
    pvdr: true,
    net1: true,
  },

};
