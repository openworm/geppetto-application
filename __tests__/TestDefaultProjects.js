
import {
  testSingleCompononetHHProject,
  testACNET2Project,
  testC302NetworkProject, testCa1Project
} from './NeuronalTestsLogic'


describe('Test UI Components', () => {
  beforeAll(async () => {
    jest.setTimeout(90000);
    
  });

  //describe('Single Component HH Project', () => testSingleCompononetHHProject());
  //describe('Acnet project', () => testACNET2Project());
  //describe('C302 Network project', () => testC302NetworkProject());
  describe('Ca1 project', () => testCa1Project());


  afterAll(async () => {
  })


});
