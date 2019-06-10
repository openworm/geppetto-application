const { TimeoutError } = require('puppeteer/Errors');


export const wait4selector = async (selector, settings = {}) => {
  let success = undefined;
  const options = { timeout: 1000, ...settings }
  try {
    await page.waitForSelector(selector, options);
    success = true
  } catch (error){
    let behaviour = "to exists."
    if (options.visible || options.hidden) {
      behaviour = options.visible ? "to be visible." : "to disappear."
    }
    console.log(`ERROR: timeout waiting for selector   --->   ${selector}    ${behaviour}`)
  }
  expect(success).toBeDefined()
}


export const click = async selector => {
  await wait4selector(selector, { visible: true });
  let success = undefined;
  try {
    await page.click(selector);
    success = true
  } catch (error){
    console.log(`ERROR clicking on selector   --->   ${selector} failed.`)
  }
  expect(success).toBeDefined()
}
