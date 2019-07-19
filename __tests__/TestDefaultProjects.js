
import { getUrlFromProjectId } from './cmdline.js';
import {
  testSingleCompononetHHProject,
  testACNET2Project
} from './NeuronalTestsLogic'


describe('Test UI Components', () => {
  beforeAll(async () => {
    jest.setTimeout(30000);
    
  });

  describe('Single Component HH Project', () => testSingleCompononetHHProject());
  describe('Acnet project', () => testACNET2Project());


  afterAll(async () => {
  })


});
