
import { getUrlFromProjectId } from './cmdline.js';
import { testSingleCompononetHHProject } from './NeuronalTestsLogic'


describe('Test UI Components', () => {
  beforeAll(async () => {
    jest.setTimeout(30000);
    
    await page.goto(getUrlFromProjectId(1));
    
  });


  describe('Single Component HH Project', () => testSingleCompononetHHProject());


  afterAll(async () => {
  })


});
