
import {
  testSingleCompononetHHProject,
  testACNET2Project,
  testC302NetworkProject
} from './NeuronalTestsLogic'


describe('Test UI Components', () => {
  beforeAll(async () => {
    jest.setTimeout(90000);
    
  });

  describe('Single Component HH Project', () => testSingleCompononetHHProject());
  describe('Acnet project', () => testACNET2Project());
  describe('C302 Network project', () => testC302NetworkProject());


  afterAll(async () => {
  })


});
